import * as Sentry from "@sentry/electron/renderer";

Sentry.init({
	dsn: "https://392b9a7bcc324b2dbdff0146ccfee044@o1075083.ingest.sentry.io/6075223",
});

import { ipcRenderer, webFrame } from "electron";
import { getInitialStateRenderer } from "electron-redux";
import React from "react";
import { setSelectedProject, setShowShouldOnboardingOverlay } from "../store/actions/app";
import configureStore from "../store/configureStore";
import { iReduxState } from "../store/reducers";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Global } from "@emotion/react";
import { css } from "@emotion/react";
import { App } from "./ui/screens/recorder/app";
import "../../static/assets/styles/tailwind.css";
import { LoginScreen } from "./ui/screens/auth/login";
import { DashboardScreen } from "./ui/screens/dashboard";
import { UnDockCodeScreen } from "./ui/screens/undockCode";
import { SettingsScreen } from "./ui/screens/settings";
import { CustomRouter } from "./utils/history";
import { ProjectsListScreen } from "./ui/screens/projectList";
import { ToastSnackbar } from "./ui/containers/components/toast";
import { AuthOnboardingScreen } from "./ui/screens/authOnboarding";
import { SWRConfig } from "swr";
import { NetworkErrorContainer } from "./ui/containers/errors/networkError";
import { UnAuthorizedErrorContainer } from "./ui/containers/errors/unauthorizedError";
import { InvalidCredsErrorContainer } from "./ui/containers/errors/invalidCreds";
import { performGoToUrl, performTestDeepLink, performTrackEvent } from "../ipc/perform";
import { Provider as JotaiProvider } from "jotai";
import { ToastBox } from "./ui/components/toasts";
import { CloudCrusher } from "../lib/cloud";
import { Store } from "redux";
import { IDeepLinkAction } from "../types";
import { triggerLocalBuild, triggerLocalBuildFromDeeplink } from "./utils/recorder";
import { DesktopAppEventsEnum } from "@shared/modules/analytics/constants";
import { OnboardingWrapper } from "./ui/screens/onboarding";

webFrame.setVisualZoomLevelLimits(1, 3);

function getPersistStore() {
	const initialReduxState: iReduxState = getInitialStateRenderer();
	// Will only be used in renderer store ( won't be tarnsim)
	const shouldShowOnboardingOverlay = !(localStorage.getItem("app.showShouldOnboardingOverlay") === "false");

	const store = configureStore(initialReduxState, "renderer");
	store.dispatch(setShowShouldOnboardingOverlay(shouldShowOnboardingOverlay));
	return store;
}

const handleUrlAction = async (store: Store, event: Electron.IpcRendererEvent, { action }: { action: IDeepLinkAction }) => {
	console.log("Action recieved", action);
	switch (action.commandName) {
		case "run-tests-in-local-build": {
			const { tests } = action.args;
			const testIds = tests.split(","); 
			await triggerLocalBuildFromDeeplink(testIds);
			break;
		}
		case "run-local-build":{
			const { buildId } = action.args;
			const buildReport = await CloudCrusher.getBuildReportBuildMeta(buildId);
			store.dispatch(setSelectedProject(buildReport.projectId));
			const testIds = buildReport.tests.map((test) => test.id);

			performTrackEvent(DesktopAppEventsEnum.DEEPLINK_RUN_LOCAL_BUILD, {
				buildId: buildId,
			});
			triggerLocalBuild(
				testIds,
				buildReport.tests.map((test) => ({ ...test, testName: test.name })),
				buildReport.host,
				"deeplink",
				{
					buildId: buildId,
				},
			);
			break;
		}
	}
};

const store = getPersistStore();

const globalStyle = css`
	.drag {
		-webkit-app-region: drag;
	}
	.no-drag {
		-webkit-app-region: no-drag;
	}
`;

function InsideRouter() {
	const handleErrorCallback = React.useCallback((err, key, config) => {
		if (err.message.includes("status code 401")) {
			console.log("Unauthorized API: ", key, config);
			performGoToUrl("/unauthorized_error");
		} else {
			performGoToUrl("/network_error");
		}
	}, []);

	React.useEffect(() => {
		(window as any).performTestDeepLink = performTestDeepLink;
		const listener = handleUrlAction.bind(null, store);
		ipcRenderer.on("url-action", listener);
		window.triggerLocalBuild = listener.bind(null, null, { action: { commandName: "run-local-build", args: { buildId: "29372" } } });

		return () => {
			ipcRenderer.removeListener("url-action", listener);
		};
	}, []);

	return (
		<JotaiProvider>
			<SWRConfig value={{ onError: handleErrorCallback.bind(this) }}>
				<ToastSnackbar />
				<ToastBox />
				<Global styles={globalStyle} />
				<Routes>
					<Route path="/login" element={<LoginScreen />} />
					<Route path="/onboarding" element={<AuthOnboardingScreen />} />
					{/* Revert this after commit */}
					<Route path="/dashboard" element={<DashboardScreen />} />
					<Route path="/project-onboarding" element={<OnboardingWrapper />} />
					<Route path="/" element={<DashboardScreen />} />
					<Route path="/select-project" element={<ProjectsListScreen />} />
					<Route path="/code-editor" element={<UnDockCodeScreen />} />
					<Route path="/settings" element={<SettingsScreen />} />
					<Route path="/recorder" element={<App />} />
					<Route path="/network_error" element={<NetworkErrorContainer />} />
					<Route path="/unauthorized_error" element={<UnAuthorizedErrorContainer />} />
					<Route path="/invalid_creds_error" element={<InvalidCredsErrorContainer />} />
				</Routes>
			</SWRConfig>
		</JotaiProvider>
	);
}

function RootApp() {
	return (
		<Provider store={store}>
			<CustomRouter>
				<InsideRouter />
			</CustomRouter>
		</Provider>
	);
}

render(<RootApp />, document.querySelector("#app-container"));

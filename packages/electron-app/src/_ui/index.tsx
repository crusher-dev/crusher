import { webFrame } from "electron";
import { getInitialStateRenderer } from "electron-redux";
import React from "react";
import { setShowShouldOnboardingOverlay } from "../store/actions/app";
import configureStore from "../store/configureStore";
import { iReduxState } from "../store/reducers";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Global } from "@emotion/react";
import { css } from "@emotion/react";
import { App } from "./app";
import "../../static/assets/styles/tailwind.css";
import { LoginScreen } from "./screens/auth/login";
import { DashboardScreen } from "./screens/dashboard";
import { UnDockCodeScreen } from "./screens/undockCode";
import { SettingsScreen } from "./screens/settings";
import { CustomRouter } from './utils/history';
import { ProjectsListScreen } from "./screens/projectList";
import { ToastSnackbar } from "./containers/components/toast";
import { AuthOnboardingScreen } from "./screens/authOnboarding";
import { SWRConfig } from "swr";
import { NetworkErrorContainer } from "./containers/errors/networkError";
import { UnAuthorizedErrorContainer } from "./containers/errors/unauthorizedError";
import { InvalidCredsErrorContainer } from "./containers/errors/invalidCreds";
import { performGoToUrl } from "./commands/perform";
import { Provider as JotaiProvider } from "jotai";

webFrame.setVisualZoomLevelLimits(1, 3);

function getPersistStore() {
    const initialReduxState: iReduxState = getInitialStateRenderer();
    // Will only be used in renderer store ( won't be tarnsim)
    const shouldShowOnboardingOverlay = localStorage.getItem("app.showShouldOnboardingOverlay") === "false" ? false : true;

    const store = configureStore(initialReduxState, "renderer");
    store.dispatch(setShowShouldOnboardingOverlay(shouldShowOnboardingOverlay));
    return store;
}

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

    return (
        <JotaiProvider>
            <SWRConfig value={{ onError: handleErrorCallback.bind(this) }}>
                <ToastSnackbar />
                <Global styles={globalStyle} />
                <Routes>
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/onboarding" element={<AuthOnboardingScreen />} />
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
    )
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
render(
    <RootApp />,
    document.querySelector("#app-container"),
);

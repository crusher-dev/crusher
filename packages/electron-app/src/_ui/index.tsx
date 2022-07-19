import { webFrame } from "electron";
import { getInitialStateRenderer } from "electron-redux";
import React from "react";
import { getGlobalAppConfig } from "../lib/global-config";
import { setSettngs, setShowShouldOnboardingOverlay, setUserAccountInfo } from "../store/actions/app";
import configureStore from "../store/configureStore";
import { iReduxState } from "../store/reducers";
import { render } from "react-dom";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import { Router, Route, NavLink, HashRouter, Routes, useNavigate, HashRouterProps } from "react-router-dom";
import { Store } from "redux";
import { Global } from "@emotion/react";
import { css } from "@emotion/react";
import { App } from "./app";
import "../../static/assets/styles/tailwind.css";
import { LoginScreen } from "./screens/auth/login";
import { CreateTestScreen } from "../ui/screens/createTest";
import { DashboardScreen } from "./screens/dashboard";
import { SelectProjectScreen } from "../ui/screens/selectProject";
import { UnDockCodeScreen } from "../ui/screens/undockCode";
import {SettingsScreen} from "./screens/settings";
import historyInstance, { CustomRouter } from './utils/history';
import { ProjectsListScreen } from "./screens/projectList";
import { ToastSnackbar } from "../ui/components/toast";

const globalAppConfig = getGlobalAppConfig();
webFrame.setVisualZoomLevelLimits(1, 3);

function getPersistStore() {
    const initialReduxState: iReduxState = getInitialStateRenderer();
    
    initialReduxState.app.shouldShowOnboardingOverlay = localStorage.getItem("app.showShouldOnboardingOverlay") === "false" ? false : true;
    if(localStorage.getItem("app.settings")) {
        initialReduxState.app.settings = JSON.parse(localStorage.getItem("app.settings"));
    } else {
        // Modify BACKEND_URL and FRONTEND_URL to default values
        initialReduxState.app.settings.backendEndPoint = process.env.BACKEND_URL;
        initialReduxState.app.settings.frontendEndPoint = process.env.FRONTEND_URL;
    }

    const store = configureStore(initialReduxState, "renderer");

    if (globalAppConfig && globalAppConfig.userInfo) {
        store.dispatch(setUserAccountInfo(globalAppConfig.userInfo));
    }
    store.dispatch(setSettngs(initialReduxState.app.settings));
    store.dispatch(setShowShouldOnboardingOverlay(initialReduxState.app.shouldShowOnboardingOverlay));

    return store;
}


const globalStyle = css`
    .drag {
        -webkit-app-region: drag;
    }
    .no-drag {
        -webkit-app-region: no-drag;
    }
`;


render(
	<Provider store={getPersistStore()}>
		<CustomRouter>
			<ToastSnackbar />
            <Global styles={globalStyle}/>
			<Routes>
                <Route path="/login" element={<LoginScreen />} />
				<Route path="/" element={<DashboardScreen />} />
				<Route path="/select-project" element={<ProjectsListScreen />} />
				<Route path="/create-test" element={<CreateTestScreen />} />
				<Route path="/code-editor" element={<UnDockCodeScreen />} />
				<Route path="/settings" element={<SettingsScreen />} />
				<Route path="/recorder" element={<App/>} />
			</Routes>
		</CustomRouter>
	</Provider>,
	document.querySelector("#app-container"),
);

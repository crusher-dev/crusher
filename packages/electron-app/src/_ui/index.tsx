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
import { AuthOnboardingScreen } from "../ui/screens/authOnboarding";
import { SWRConfig } from "swr";
import { NetworkErrorContainer } from "./containers/errors/networkError";

webFrame.setVisualZoomLevelLimits(1, 3);

function getPersistStore() {
    const initialReduxState: iReduxState = getInitialStateRenderer();

    const store = configureStore(initialReduxState, "renderer");
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

function RootApp() {
    const [showNetworkError, setShowNetworkError] = React.useState(false);
    const handleErrorCallback = React.useCallback(() => {
        setShowNetworkError(true);
    }, []);

   return (
    <Provider store={store}>
        <SWRConfig value={{   onError: handleErrorCallback.bind(this) }}>
            <CustomRouter>
                <ToastSnackbar />
            {showNetworkError ? (
                <NetworkErrorContainer/>
            ) : ""}
                <Global styles={globalStyle}/>
                <Routes>
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/onboarding" element={<AuthOnboardingScreen />} />
                    <Route path="/" element={<DashboardScreen />} />
                    <Route path="/select-project" element={<ProjectsListScreen />} />
                    <Route path="/create-test" element={<CreateTestScreen />} />
                    <Route path="/code-editor" element={<UnDockCodeScreen />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                    <Route path="/recorder" element={<App/>} />
                </Routes>
            </CustomRouter>
        </SWRConfig>
	</Provider>
   );
}
render(
	<RootApp/>,
	document.querySelector("#app-container"),
);

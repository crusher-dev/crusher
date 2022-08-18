import { resolveToBackendPath, resolveToFrontEndPath } from "@shared/utils/url";
import { getStore } from "../store/configureStore";
import { getAppSettings, getUserAccountInfo } from "../store/selectors/app";

const resolveToBackend = (endpoint: string) => {
    const store: any = getStore();
    const appSettings = getAppSettings(store.getState());

    return appSettings.backendEndPoint ? resolveToBackendPath(endpoint, appSettings.backendEndPoint) : resolveToBackendPath(endpoint);
};

const resolveToFrontend = (endpoint: string) => {
	const store: any = getStore();
	const appSettings = getAppSettings(store.getState());

	return appSettings.frontendEndPoint ? resolveToFrontEndPath(endpoint, appSettings.frontendEndPoint) : resolveToFrontEndPath(endpoint);
};

const createAuthorizedRequestFunc = (callback, silent = false) => {
    return (...args) => {
        const store: any = getStore();
        const userInfo = getUserAccountInfo(store.getState());
        const isUserLoggedIn = userInfo && userInfo.token;
        if(!isUserLoggedIn && !silent) { throw new Error("User not logged in"); }
        
        const headers = {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        };

        if(isUserLoggedIn) {
            headers["Authorization"] =  `${userInfo.token}`;
        }
        
        return callback({ headers, withCredentials: true }, ...args);
    };
};

const checkIfLoggedIn = () => {
    const store: any = getStore();
    const userInfo = getUserAccountInfo(store.getState());

    return userInfo && userInfo.token ? true : false;
};
export { resolveToBackend, resolveToFrontend, createAuthorizedRequestFunc, checkIfLoggedIn };
import { iReduxState } from "../reducers";
import { IProxyState, ISessionMeta } from "../reducers/app";

export const SET_SHOW_SHOULD_ONBOARDING_OVERLAY = "SET_SHOW_SHOULD_ONBOARDING_OVERLAY";
export const SET_SESSION_META = "SET_SESSION_META";
export const SET_SETTINGS = "SET_SETTINGS";
export const SET_USER_ACCOUNT_INFO = "SET_USER_ACCOUNT_INFO";
export const RESET_APP_SESSION = "RESET_APP_SESSION";
export const SET_PROXY_STATE = "SET_PROXY_STATE";
export const SET_PROXY_INITIALIZING = "SET_PROXY_INITIALIZING";

export const setProxyState = (proxyState: IProxyState) => ({
	type: SET_PROXY_STATE,
	payload: { proxyState },
});

export const setShowShouldOnboardingOverlay = (shouldShow: boolean) => ({
	type: SET_SHOW_SHOULD_ONBOARDING_OVERLAY,
	payload: { shouldShow },
});

export const setSessionInfoMeta = (sessionMeta: ISessionMeta) => ({
	type: SET_SESSION_META,
	payload: { sessionMeta },
});

export const setSettngs = (settings: iReduxState["app"]["settings"]) => ({
	type: SET_SETTINGS,
	payload: { settings },
});

export const setUserAccountInfo = (info) => {
	return {
		type: SET_USER_ACCOUNT_INFO,
		payload: { info },
	};
};

export const resetAppSession = () => {
	return {
		type: RESET_APP_SESSION,
	};
};

export const setProxyInitializing = (isInitializing: boolean) => ({
	type: SET_PROXY_INITIALIZING,
	payload: { isInitializing },
});

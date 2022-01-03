import { iReduxState } from "../reducers";
import { ISessionMeta } from "../reducers/app";

export const SET_SHOW_SHOULD_ONBOARDING_OVERLAY = "SET_SHOW_SHOULD_ONBOARDING_OVERLAY";
export const SET_SESSION_META = "SET_SESSION_META";
export const SET_SETTINGS = "SET_SETTINGS";

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
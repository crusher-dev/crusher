import { iReduxState } from "../reducers";

export const shouldShowOnboardingOverlay = (state: iReduxState) => state.app.shouldShowOnboardingOverlay;

export const getAppSessionMeta = (state: iReduxState) => state.app.sessionMeta;

export const getAppEditingSessionMeta = (state: iReduxState) => state.app.sessionMeta.editing;

export const getAppSettings = (state: iReduxState) => state.app.settings;

export const getRemainingSteps = (state: iReduxState) => state.app.sessionMeta.remainingSteps;

export const getUserAccountInfo = (state: iReduxState) => state.app.accountInfo;

export const getProxyState = (state: iReduxState) => state.app.proxy;

export const getIsProxyInitializing = (state: iReduxState) => state.app.proxyIsInitializing;
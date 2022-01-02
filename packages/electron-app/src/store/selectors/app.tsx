import { iReduxState } from "../reducers";

export const shouldShowOnboardingOverlay = (state: iReduxState) => state.app.shouldShowOnboardingOverlay;

export const getAppSessionMeta = (state: iReduxState) => state.app.sessionMeta;

export const getAppEditingSessionMeta = (state: iReduxState) => state.app.sessionMeta.editing;

export const getAppSettings = (state: iReduxState) => state.app.settings;
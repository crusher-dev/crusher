import { iReduxState } from "../reducers";

export const shouldShowOnboardingOverlay = (state: iReduxState) => state.app.shouldShowOnboardingOverlay;
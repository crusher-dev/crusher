import { iReduxState } from "../reducers";

export const isOnboardingRemaining = (state: iReduxState) => !state.onboardingReducer.isComplete;

export const getCurrentOnboardingStep = (state: iReduxState) => state.onboardingReducer.currentStep;

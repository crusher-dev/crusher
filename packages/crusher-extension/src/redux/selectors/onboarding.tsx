import { iReduxState } from "../reducers";

export const isOnboardingRemaining = (state: iReduxState) =>
	!state.onboarding.isComplete;

export const getCurrentOnboardingStep = (state: iReduxState) =>
	state.onboarding.currentStep;

export const MARK_ONBOARDING_COMPLETE = "MARK_ONBOARDING_COMPLETE";
export const SET_CURRENT_ONBOARDING_STEP = "SET_CURRENT_ONBOARDING_STEP";

export const markOnboardingComplete = () => ({
	type: MARK_ONBOARDING_COMPLETE,
});
export const updateCurrentOnboardingStep = (currentStep: number) => ({
	type: SET_CURRENT_ONBOARDING_STEP,
	payload: { step: currentStep },
});

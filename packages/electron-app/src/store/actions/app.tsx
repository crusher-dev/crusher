export const SET_SHOW_SHOULD_ONBOARDING_OVERLAY = "SET_SHOW_SHOULD_ONBOARDING_OVERLAY";

export const setShowShouldOnboardingOverlay = (shouldShow: boolean) => ({
    type: SET_SHOW_SHOULD_ONBOARDING_OVERLAY,
    payload: { shouldShow },
});

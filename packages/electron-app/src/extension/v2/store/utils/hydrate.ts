const hydrateApp = (setAppStateItem) => {
    const showShouldOnboardingOverlay = localStorage.getItem('app.showShouldOnboardingOverlay');
    if (showShouldOnboardingOverlay) {
        setAppStateItem({key: 'showShouldOnboardingOverlay', value : showShouldOnboardingOverlay === "false" ? false : true});
    }
}

export { hydrateApp };
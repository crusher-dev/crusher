export const getGithubInstallationOptions = (state) =>
	state.github.installationOptions;
export const getSelectedGithubInstallationOption = (state) =>
	state.github.selectedInstallation;

export const getReposForSelectedInstallation = (state) => {
	const selectedInstallation = getSelectedGithubInstallationOption(state);
	if (!selectedInstallation) return null;

	return state.github.installationRepos[selectedInstallation.value]
		? state.github.installationRepos[selectedInstallation.value]
		: null;
};

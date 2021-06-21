import { iGithubIntegration } from "@crusher-shared/types/mongo/githubIntegration";

export const getGithubInstallationOptions = (state) => state.github.installationOptions;
export const getSelectedGithubInstallationOption = (state) => state.github.selectedInstallation;
export const getLinkedGithubRepos = (state): iGithubIntegration[] => state.github.connectedGithubRepos;

export const getReposForSelectedInstallation = (state) => {
	const selectedInstallation = getSelectedGithubInstallationOption(state);
	if (!selectedInstallation) return null;

	return state.github.installationRepos[selectedInstallation.value] || null;
};

import { iGithubInstallation } from "@interfaces/githubInstallations";
import { iGithubIntegration } from "@crusher-shared/types/mongo/githubIntegration";

export const SAVE_GITHUB_INSTALLATION_OPTIONS = "SET_GITHUB_INSTALLATIONS";
export const SET_SELECTED_GITHUB_INSTALLATION_OPTION = "SET_SELECTED_GITHUB_INSTALLATION";
export const SAVE_REPOS_FOR_INSTALLATION = "SAVE_REPOS_FOR_INSTALLATION";
export const SAVE_LINKED_GITHUB_REPOS = "SAVE_LINKED_GITHUB_REPOS";
export const ADD_LINKED_GITHUB_REPO = "ADD_LINKED_GITHUB_REPO";
export const REMOVE_LINKED_GITHUB_REPO = "REMOVE_LINKED_GITHUB_REPO";

export const saveGithubInstallationOptions = (installations: iGithubInstallation[]) => ({
	type: SAVE_GITHUB_INSTALLATION_OPTIONS,
	payload: {
		installations: installations,
	},
});

export const setSelectedGithubInstallationOption = (option: iGithubInstallation) => ({
	type: SET_SELECTED_GITHUB_INSTALLATION_OPTION,
	payload: {
		selected: option,
	},
});

export const saveReposForInstallation = (installationId: number, repos: any[]) => ({
	type: SAVE_REPOS_FOR_INSTALLATION,
	payload: {
		installationId: installationId,
		repos: repos,
	},
});

export const saveLinkedGithubRepos = (linkedRepos: iGithubIntegration[]) => ({
	type: SAVE_LINKED_GITHUB_REPOS,
	payload: {
		linkedRepos: linkedRepos,
	},
});

export const addLinkedGithubRepoInList = (linkedRepo: iGithubIntegration) => ({
	type: ADD_LINKED_GITHUB_REPO,
	payload: {
		linkedRepo: linkedRepo,
	},
});

export const removeLinkedGithubRepoInList = (integrationId: string) => ({
	type: REMOVE_LINKED_GITHUB_REPO,
	payload: {
		integrationId: integrationId,
	},
});

import { iGithubInstallation } from "@interfaces/githubInstallations";

export const SAVE_GITHUB_INSTALLATION_OPTIONS = "SET_GITHUB_INSTALLATIONS";
export const SET_SELECTED_GITHUB_INSTALLATION_OPTION =
	"SET_SELECTED_GITHUB_INSTALLATION";
export const SAVE_REPOS_FOR_INSTALLATION = "SAVE_REPOS_FOR_INSTALLATION";

export const saveGithubInstallationOptions = (
	installations: Array<iGithubInstallation>,
) => ({
	type: SAVE_GITHUB_INSTALLATION_OPTIONS,
	payload: {
		installations: installations,
	},
});

export const setSelectedGithubInstallationOption = (
	option: iGithubInstallation,
) => ({
	type: SET_SELECTED_GITHUB_INSTALLATION_OPTION,
	payload: {
		selected: option,
	},
});

export const saveReposForInstallation = (
	installationId: number,
	repos: Array<any>,
) => ({
	type: SAVE_REPOS_FOR_INSTALLATION,
	payload: {
		installationId: installationId,
		repos: repos,
	},
});

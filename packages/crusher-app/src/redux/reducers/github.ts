import {
	SAVE_GITHUB_INSTALLATION_OPTIONS,
	SAVE_REPOS_FOR_INSTALLATION,
	SET_SELECTED_GITHUB_INSTALLATION_OPTION,
} from "@redux/actions/github";
import { iGithubInstallation } from "@interfaces/githubInstallations";

interface iGithubInitialState {
	installationOptions: Array<iGithubInstallation>;
	selectedInstallation: null | number;
	installationRepos: any;
}

const initialState: iGithubInitialState = {
	installationOptions: [],
	selectedInstallation: null,
	installationRepos: {},
};

const github = (state = initialState, action: any) => {
	switch (action.type) {
		case SAVE_GITHUB_INSTALLATION_OPTIONS:
			return {
				...state,
				installationOptions: action.payload.installations,
			};
		case SET_SELECTED_GITHUB_INSTALLATION_OPTION:
			return {
				...state,
				selectedInstallation: action.payload.selected,
			};
		case SAVE_REPOS_FOR_INSTALLATION:
			return {
				...state,
				installationRepos: {
					...state.installationRepos,
					[action.payload.installationId]: action.payload.repos,
				},
			};
		default:
			return state;
	}
};

export default github;

import {
	ADD_LINKED_GITHUB_REPO,
	REMOVE_LINKED_GITHUB_REPO,
	SAVE_GITHUB_INSTALLATION_OPTIONS,
	SAVE_LINKED_GITHUB_REPOS,
	SAVE_REPOS_FOR_INSTALLATION,
	SET_SELECTED_GITHUB_INSTALLATION_OPTION,
} from "@redux/actions/github";
import { iGithubInstallation } from "@interfaces/githubInstallations";
import { iGithubIntegration } from "@crusher-shared/types/mongo/githubIntegration";

interface iGithubInitialState {
	installationOptions: iGithubInstallation[];
	selectedInstallation: null | number;
	installationRepos: any;
	connectedGithubRepos: iGithubIntegration[];
}

const initialState: iGithubInitialState = {
	installationOptions: [],
	selectedInstallation: null,
	installationRepos: {},
	connectedGithubRepos: [],
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
		case SAVE_LINKED_GITHUB_REPOS:
			return {
				...state,
				connectedGithubRepos: action.payload.linkedRepos,
			};
		case ADD_LINKED_GITHUB_REPO:
			return {
				...state,
				connectedGithubRepos: [...state.connectedGithubRepos, action.payload.linkedRepo],
			};
		case REMOVE_LINKED_GITHUB_REPO: {
			const newConnectedGithubRepos = state.connectedGithubRepos.filter((repo) => {
				return repo._id !== action.payload.integrationId;
			});

			return {
				...state,
				connectedGithubRepos: newConnectedGithubRepos,
			};
		}
		default:
			return state;
	}
};

export default github;

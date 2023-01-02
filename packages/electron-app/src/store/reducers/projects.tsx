import { AnyAction } from "redux";
import { SET_SELECTED_PROJECT } from "../actions/app";
import { SET_ALL_PROJECTS_METADATA, SET_PROJECTS_METADATA } from "../actions/projects";

interface IEnvironmentConfig {
    name: string;
    path: string;
    variables: any;
};

export interface IProjectMetaData {
	id: string | number;
    configPath: string;
    environments: { [key: string]: IEnvironmentConfig };

	selectedEnvironment: string;
};

interface IProjectsReducer {
    selectedProject: number | string | null;
    metadata: { [key: number | string ]: IProjectMetaData };
}

const initialState: IProjectsReducer = {
    selectedProject: null,
    metadata: {},
};

const projectsReducer = (state: IProjectsReducer = initialState, action: AnyAction): IProjectsReducer => {
	switch (action.type) {
		case SET_ALL_PROJECTS_METADATA:
			return {
				...state,
				metadata: action.payload.projects,
			};
		case SET_PROJECTS_METADATA: {
			const projectsPayload = action.payload.project as IProjectMetaData;
			const projectId = action.payload.projectId as number;

			return {
				...state,
				metadata: {
					...state.metadata,
					[projectId]: projectsPayload,
				},
			};
		}
		case SET_SELECTED_PROJECT:
			return {
				...state,
				selectedProject: action.payload.projectId,
			};
		default:
			return state;
	}
};

export { IProjectsReducer, projectsReducer };

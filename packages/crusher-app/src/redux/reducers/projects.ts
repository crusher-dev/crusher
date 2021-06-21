import { ADD_PROJECT, DELETE_PROJECT, SAVE_PROJECTS, SAVE_SELECTED_PROJECT, SET_CURRENT_PROJECT_INFO, SET_PROJECT_MEMBERS } from "@redux/actions/project";
import jsCookie from "js-cookie";
import { HYDRATE } from "next-redux-wrapper";
import { extractHostnameFromUrl } from "@utils/helpers";
import { BACKEND_SERVER_URL } from "@constants/other";
import { iProjectInfoResponse } from "@crusher-shared/types/response/projectInfoResponse";
import { iMemberInfoResponse } from "@crusher-shared/types/response/membersInfoResponse";

const initialState = {
	allProjects: [],
	selectedProject: null,
	currentProjectInfo: null as iProjectInfoResponse | null,
	members: {},
};

const projects = (state = initialState, action) => {
	switch (action.type) {
		case HYDRATE:
			return { ...state, ...action.payload.projects };
		case SET_CURRENT_PROJECT_INFO:
			return { ...state, currentProjectInfo: action.payload.info };
		case SET_PROJECT_MEMBERS: {
			const _membersMap = ((action.payload.members as iMemberInfoResponse[])).reduce((prev, current) => {
				return { ...prev, [current.id]: current };
			}, {});

			return {
				...state,
				members: {
					...state.members,
					[action.payload.projectId]: _membersMap,
				},
			};
		}
		case SAVE_PROJECTS:
			return {
				...state,
				allProjects: action.allProjects,
				selectedProject: !state.selectedProject ? action.allProjects[0].id : state.selectedProject,
			};
		case SAVE_SELECTED_PROJECT:
			if (action.projectId) {
				jsCookie.set("selectedProject", action.projectId, {
					domain: extractHostnameFromUrl(BACKEND_SERVER_URL),
				});
			}
			return { ...state, selectedProject: action.projectId };
		case ADD_PROJECT:
            return {
				...state,
				allProjects: [...state.allProjects, { name: action.name, id: action.id }],
			};
		case DELETE_PROJECT:
			const filteredAllProjects = state.allProjects.filter((project: any) => {
				return project.id !== action.id;
			});
			return { ...state, allProjects: filteredAllProjects };

		case "persist/REHYDRATE":
			return {
				...state,
				selectedProject: action.payload?.selectedProject ? action.payload.projects.selectedProject : state.selectedProject,
				allProjects: state.allProjects,
			};
		default:
			return state;
	}
};

export default projects;

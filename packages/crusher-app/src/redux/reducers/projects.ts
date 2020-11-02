import { SAVE_PROJECTS, SAVE_SELECTED_PROJECT } from "@redux/actions/action";
import jsCookie from "js-cookie";
import { HYDRATE } from "next-redux-wrapper";
import { extractHostnameFromUrl } from "@utils/helpers";
import { BACKEND_SERVER_URL } from "@constants/other";

const initialState = {
	allProjects: [],
	selectedProject: null,
};

const projects = (state = initialState, action) => {
	switch (action.type) {
		case HYDRATE:
			return { ...state, ...action.payload.projects };
		case SAVE_PROJECTS:
			console.log(action.allProjects);
			return {
				...state,
				allProjects: action.allProjects,
				selectedProject: !state.selectedProject
					? action.allProjects[0].id
					: state.selectedProject,
			};
		case SAVE_SELECTED_PROJECT:
			jsCookie.set("selectedProject", action.projectId, {
				domain: extractHostnameFromUrl(BACKEND_SERVER_URL),
			});
			return { ...state, selectedProject: action.projectId };
		case "persist/REHYDRATE":
			return {
				...state,
				selectedProject:
					action.payload && action.payload.selectedProject
						? action.payload.projects.selectedProject
						: state.selectedProject,
				allProjects: state.allProjects,
			};
		default:
			return state;
	}
};

export default projects;

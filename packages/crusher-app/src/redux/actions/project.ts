import { iProjectInfoResponse } from "@crusher-shared/types/response/projectInfoResponse";
import { iMemberInfoResponse } from "@crusher-shared/types/response/membersInfoResponse";
import { iAllProjectsItemResponse } from "@crusher-shared/types/response/allProjectsResponse";

export const SET_USER_DATA = "ADD_USER_DATA";
export const SAVE_PROJECTS = "SET_PROJECT";
export const SAVE_SELECTED_PROJECT = "SET_SELECTED_PROJECT";
export const ADD_PROJECT = "ADD_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";
export const SET_CURRENT_PROJECT_INFO = "SET_CURRENT_PROJECT_INFO";
export const SET_PROJECT_MEMBERS = "SET_TEAM_MEMBERS";

export const setProjectMembers = (projectId: number, members: iMemberInfoResponse[]) => ({
	type: SET_PROJECT_MEMBERS,
	payload: { projectId, members },
});

export const setCurrentProjectInfo = (info: iProjectInfoResponse) => ({
	type: SET_CURRENT_PROJECT_INFO,
	payload: {
		info,
	},
});

export const setUserDataInState = (data: any) => ({
	type: SET_USER_DATA,
	data,
});

export const addProjectInRedux = (name: string, id: any) => ({
	type: ADD_PROJECT,
	name,
	id,
});

export const deleteProjectFromRedux = (id: number) => ({
	type: DELETE_PROJECT,
	id,
});

export const saveSelectedProjectInRedux = (projectId: number) => ({
	type: SAVE_SELECTED_PROJECT,
	projectId,
});

export const saveProjectsInRedux = (allProjects: iAllProjectsItemResponse[]) => ({
	type: SAVE_PROJECTS,
	allProjects: allProjects,
});

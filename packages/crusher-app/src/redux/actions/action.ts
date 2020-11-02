export const SET_USER_DATA = "ADD_USER_DATA";
export const SAVE_PROJECTS = "SET_PROJECT";
export const SAVE_SELECTED_PROJECT = "SET_SELECTED_PROJECT";

export const setUserDataInState = (data) => ({
	type: SET_USER_DATA,
	data,
});

export const saveSelectedProjectInRedux = (projectId) => ({
	type: SAVE_SELECTED_PROJECT,
	projectId,
});

export const saveProjectsInRedux = (allProjects) => ({
	type: SAVE_PROJECTS,
	allProjects: allProjects,
});

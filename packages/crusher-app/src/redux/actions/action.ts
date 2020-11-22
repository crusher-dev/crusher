export const SET_USER_DATA = "ADD_USER_DATA";
export const SAVE_PROJECTS = "SET_PROJECT";
export const SAVE_SELECTED_PROJECT = "SET_SELECTED_PROJECT";
export const ADD_PROJECT = "ADD_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";

export const setUserDataInState = (data) => ({
	type: SET_USER_DATA,
	data,
});

export const addProjectInRedux = (name, id) => ({
	type: ADD_PROJECT,
	name,
	id,
});

export const deleteProjectFromRedux = (id) => ({
	type: DELETE_PROJECT,
	id,
});

export const saveSelectedProjectInRedux = (projectId) => ({
	type: SAVE_SELECTED_PROJECT,
	projectId,
});

export const saveProjectsInRedux = (allProjects) => ({
	type: SAVE_PROJECTS,
	allProjects: allProjects,
});

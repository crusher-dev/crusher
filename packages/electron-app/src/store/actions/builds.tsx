import { IBuildNotification, IBuildResultPayload, ICurrentBuildPayload } from "../reducers/builds";

export const TRIGGER_LOCAL_BUILD = "TRIGGER_LOCAL_BUILD";
export const CLEAR_CURRENT_LOCAL_BUILD = "CLEAR_CURRENT_LOCAL_BUILD";
export const UPDATE_LOCAL_BUILD_RESULT = "UPDATE_LOCAL_BUILD_RESULT";
export const UPDATE_CURRENT_LOCAL_BUILD = "UPDATE_CURRENT_LOCAL_BUILD";
export const ADD_BUILD_NOTIFICATION = "ADD_BUILD_NOTIFICATION";
export const UPDATE_BUILD_NOTIIFICATION = "UPDATE_BUILD_NOTIIFICATION";
export const REMOVE_BUILD_NOTIFICATION = "REMOVE_BUILD_NOTIFICATION";
export const CLEAR_BUILD_NOTIFICATIONS = "CLEAR_BUILD_NOTIFICATIONS";

export const addBuildNotification = (payload: IBuildNotification) => ({
	type: ADD_BUILD_NOTIFICATION,
	payload,
});
export const updateBuildNotification = (id: string, payload: IBuildNotification) => ({
	type: UPDATE_BUILD_NOTIIFICATION,
	payload: {
		buildId: id,
		meta: payload,
	},
});

export const removeBuildNotification = (id: string) => ({
	type: REMOVE_BUILD_NOTIFICATION,
	payload: id,
});

export const clearBuildNotifications = () => ({
	type: CLEAR_BUILD_NOTIFICATIONS,
});

export const updateCurrentLocalBuild = (payload: ICurrentBuildPayload) => ({
	type: UPDATE_CURRENT_LOCAL_BUILD,
	payload,
});
export const createLocalBuild = (payload: ICurrentBuildPayload) => ({
	type: TRIGGER_LOCAL_BUILD,
	payload,
});

export const clearCurrentLocalBuild = () => ({
	type: CLEAR_CURRENT_LOCAL_BUILD,
});

export const updateLocalBuildResult = (payload: IBuildResultPayload) => ({
	type: UPDATE_LOCAL_BUILD_RESULT,
	payload,
});

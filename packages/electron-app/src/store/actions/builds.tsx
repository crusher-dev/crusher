import { IBuildResultPayload, ICurrentBuildPayload } from "../reducers/builds";

export const TRIGGER_LOCAL_BUILD = "TRIGGER_LOCAL_BUILD";
export const CLEAR_CURRENT_LOCAL_BUILD = "CLEAR_CURRENT_LOCAL_BUILD";
export const UPDATE_LOCAL_BUILD_RESULT = "UPDATE_LOCAL_BUILD_RESULT";

export const triggerLocalBuild = (payload: ICurrentBuildPayload) => ({
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
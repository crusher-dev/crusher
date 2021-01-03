import { iAction } from "../../interfaces/actionsReducer";

export const RECORD_ACTION = "RECORD_ACTION";
export const UPDATE_LAST_RECORDED_ACTION = "UPDATE_LAST_RECORDED_ACTION";

export const recordAction = (action: iAction) => ({
	type: RECORD_ACTION,
	payload: { action },
});

export const updateLastRecordedAction = (actionToBeReplacedWith: iAction) => ({
	type: UPDATE_LAST_RECORDED_ACTION,
	payload: { actionToBeReplacedWith: actionToBeReplacedWith },
});

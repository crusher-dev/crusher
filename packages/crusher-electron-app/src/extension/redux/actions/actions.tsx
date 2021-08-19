import { iAction } from "@shared/types/action";
import { getStore } from "../store";
import { isRecorderScriptBooted } from "../selectors/recorder";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";

export const RECORD_ACTION = "RECORD_ACTION";
export const UPDATE_LAST_RECORDED_ACTION = "UPDATE_LAST_RECORDED_ACTION";
export const DELETE_RECORDED_ACTION = "DELETE_RECORDED_ACTION";

export const recordAction = (action: iAction) => {
	const store = getStore();
	const isPageLoaded = isRecorderScriptBooted(store.getState());

	// @TODO: Figure out if there is a better to prevent redundant hover action record after navigation.
	if (!isPageLoaded && action.type === ActionsInTestEnum.HOVER) {
		return {
			type: "INVALID_ACTION_RECORDED",
			payload: { error: "The recorder script hasn't been loaded" },
		};
	}

	return {
		type: RECORD_ACTION,
		payload: { action },
	};
};

export const updateLastRecordedAction = (actionToBeReplacedWith: iAction) => ({
	type: UPDATE_LAST_RECORDED_ACTION,
	payload: { actionToBeReplacedWith: actionToBeReplacedWith },
});

export const deleteRecordedAction = (actionIndex: number) => ({
	type: DELETE_RECORDED_ACTION,
	payload: { actionIndex: actionIndex },
});

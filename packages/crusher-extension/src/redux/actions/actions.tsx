import { iAction } from "../../../../crusher-shared/types/action";
import { getStore } from "../store";
import { isRecorderScriptBooted } from "../selectors/recorder";
import { ACTIONS_IN_TEST } from "../../../../crusher-shared/constants/recordedActions";

export const RECORD_ACTION = "RECORD_ACTION";
export const UPDATE_LAST_RECORDED_ACTION = "UPDATE_LAST_RECORDED_ACTION";

export const recordAction = (action: iAction) => {
	const store = getStore();
	const isPageLoaded = isRecorderScriptBooted(store.getState());

	// @TODO: Figure out if there is a better to prevent redundant hover action record after navigation.
	if (!isPageLoaded && action.type === ACTIONS_IN_TEST.HOVER) {
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

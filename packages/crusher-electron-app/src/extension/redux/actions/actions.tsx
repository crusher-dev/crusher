import { ActionStatusEnum, iAction } from "@shared/types/action";
import { getStore } from "../store";
import { isRecorderScriptBooted } from "../selectors/recorder";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";

export const RECORD_ACTION = "RECORD_ACTION";
export const UPDATE_LAST_RECORDED_ACTION = "UPDATE_LAST_RECORDED_ACTION";
export const UPDATE_LAST_RECORDED_ACTION_STATUS = "UPDATE_LAST_RECORDED_ACTION_STATUS";
export const DELETE_RECORDED_ACTION = "DELETE_RECORDED_ACTION";
export const UPDATE_ACTION_NAME = "UPDATE_ACTION_NAME";
export const UPDATE_ACTION_TIMEOUT = "UPDATE_ACTION_TIMEOUT";
export const RESET_RECORDED_ACTIONS = "RESET_RECORDED_ACTIONS";
export const UPDATE_LAST_RECORDED_ACTION_OPTINALITY = "UPDATE_LAST_RECORDED_ACTION_OPTINALITY";

export const updateLastRecordedActionStatus = (actionStatus: ActionStatusEnum) => {
  return {
	type: UPDATE_LAST_RECORDED_ACTION_STATUS,
	payload: {
		status: actionStatus
	},
  };
};

export const recordAction = (action: iAction) => {
	const store = getStore();
	const isPageLoaded = isRecorderScriptBooted(store.getState());
	if(!action.status) {
		action.status = ActionStatusEnum.SUCCESS;
	}

	// @TODO: Figure out if there is a better to prevent redundant hover action record after navigation.
	if (!isPageLoaded && action.type === ActionsInTestEnum.HOVER) {
		return {
			type: "INVALID_ACTION_RECORDED",
			payload: { error: "The recorder script hasn't been loaded" },
		};
	}

	return {
		type: RECORD_ACTION,
		payload: {
			action,
		},
	};
};

export const updateActionName = (actionName: string, actionIndex: number) => ({
	type: UPDATE_ACTION_NAME,
	payload: { name: actionName, actionIndex },
});

export const updateActionTimeout = (actionTimeout: number, actionIndex: number) => ({
	type: UPDATE_ACTION_TIMEOUT,
	payload: { actionTimeout: actionTimeout, actionIndex },
});

export const updateLastRecordedAction = (actionToBeReplacedWith: iAction) => ({
	type: UPDATE_LAST_RECORDED_ACTION,
	payload: { actionToBeReplacedWith: actionToBeReplacedWith },
});

export const markLastRecordedActionAsOptional = (isOptional: boolean) => ({
	type: UPDATE_LAST_RECORDED_ACTION_OPTINALITY,
	payload: { isOptional: isOptional },
})

export const deleteRecordedAction = (actionIndex: number) => ({
	type: DELETE_RECORDED_ACTION,
	payload: { actionIndex: actionIndex },
});

export const resetRecordedActions = () => ({
	type: RESET_RECORDED_ACTIONS,
});

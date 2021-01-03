import { ACTIONS_RECORDING_STATE } from "../../interfaces/actionsRecordingState";
import { iSelectorInfo } from "../../utils/selector";

export const UPDATE_INSPECT_MODE_STATE = "UPDATE_INSPECT_MODE_STATE";
export const UPDATE_ACTIONS_RECORDING_STATE = "UPDATE_ACTIONS_RECORDER_STATE";

export const updateInspectModeState = (isInspectModeOn: boolean) => ({
	type: UPDATE_INSPECT_MODE_STATE,
	payload: { isInspectModeOn },
});

export const updateActionsRecordingState = (
	actionState: ACTIONS_RECORDING_STATE,
	selectedElementInfo?: {
		selectors: Array<iSelectorInfo>;
		attributes: Array<{ name: string; value: string }>;
		innerHTML: string;
	},
) => ({
	type: UPDATE_ACTIONS_RECORDING_STATE,
	payload: { state: actionState, elementInfo: selectedElementInfo },
});

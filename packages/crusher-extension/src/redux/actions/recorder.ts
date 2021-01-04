import { ACTIONS_RECORDING_STATE } from "../../interfaces/actionsRecordingState";
import { iSelectorInfo } from "../../utils/selector";
import { ACTIONS_MODAL_STATE } from "../../interfaces/actionsModalState";
import { iSeoMetaInformationMeta } from "../../messageListener";

export const UPDATE_INSPECT_MODE_STATE = "UPDATE_INSPECT_MODE_STATE";
export const UPDATE_ACTIONS_RECORDING_STATE = "UPDATE_ACTIONS_RECORDER_STATE";
export const UPDATE_RECORDER_SCRIPT_BOOTED = "UPDATE_RECORDER_SCRIPT_BOOTED";
export const UPDATE_ACTIONS_MODAL_STATE = "UPDATE_ACTIONS_MODAL_STATE";
export const ADD_SEO_META_INFO = "ADD_SEO_META_INFO";

export const updateInspectModeState = (isInspectModeOn: boolean) => ({
	type: UPDATE_INSPECT_MODE_STATE,
	payload: { isInspectModeOn },
});

export const updateActionsModalState = (
	modalState: ACTIONS_MODAL_STATE | null,
) => ({
	type: UPDATE_ACTIONS_MODAL_STATE,
	payload: { state: modalState },
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

export const updateIsRecorderScriptBooted = (
	isRecorderScriptBooted: boolean,
) => ({
	type: UPDATE_RECORDER_SCRIPT_BOOTED,
	payload: { value: isRecorderScriptBooted },
});

export const addSEOMetaInfo = (info: iSeoMetaInformationMeta) => ({
	type: ADD_SEO_META_INFO,
	payload: { info },
});

import { ACTIONS_RECORDING_STATE } from "../../interfaces/actionsRecordingState";
import { ACTIONS_MODAL_STATE } from "../../interfaces/actionsModalState";
import { iSeoMetaInformationMeta } from "../../messageListener";
import { iSelectorInfo } from "../../../../crusher-shared/types/selectorInfo";
import { iExecuteScriptOutputResponseMeta } from "../../scripts/inject/responseMessageListener";

export const UPDATE_INSPECT_MODE_STATE = "UPDATE_INSPECT_MODE_STATE";
export const UPDATE_ACTIONS_RECORDING_STATE = "UPDATE_ACTIONS_RECORDER_STATE";
export const UPDATE_RECORDER_SCRIPT_BOOTED = "UPDATE_RECORDER_SCRIPT_BOOTED";
export const UPDATE_ACTIONS_MODAL_STATE = "UPDATE_ACTIONS_MODAL_STATE";
export const ADD_SEO_META_INFO = "ADD_SEO_META_INFO";
export const UPDATE_LAST_ELEMENT_CUSTOM_SCRIPT_OUTPUT = "UPDATE_LAST_ELEMENT_CUSTOM_SCRIPT_OUTPUT";

export const TURN_ON_AUTO_RECORDER = "TURN_ON_AUTO_RECORDER";
export const TURN_OFF_AUTO_RECORDER = "TURN_OFF_AUTO_RECORDER";

export const updateInspectModeState = (isInspectModeOn: boolean) => ({
	type: UPDATE_INSPECT_MODE_STATE,
	payload: { isInspectModeOn },
});

export const updateActionsModalState = (modalState: ACTIONS_MODAL_STATE | null) => ({
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

export const updateIsRecorderScriptBooted = (isRecorderScriptBooted: boolean) => ({
	type: UPDATE_RECORDER_SCRIPT_BOOTED,
	payload: { value: isRecorderScriptBooted },
});

export const addSEOMetaInfo = (info: iSeoMetaInformationMeta) => ({
	type: ADD_SEO_META_INFO,
	payload: { info },
});

export const updateLastElementCustomScriptOutput = (info: iExecuteScriptOutputResponseMeta | null) => ({
	type: UPDATE_LAST_ELEMENT_CUSTOM_SCRIPT_OUTPUT,
	payload: { info },
});

export const updateAutoRecorderSetting = (shouldAutoRecorder: boolean) => ({
	type: shouldAutoRecorder ? TURN_ON_AUTO_RECORDER : TURN_OFF_AUTO_RECORDER,
});

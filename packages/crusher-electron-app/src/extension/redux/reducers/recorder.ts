import { AnyAction } from "redux";
import {
	ADD_SEO_META_INFO,
	TURN_OFF_AUTO_RECORDER,
	TURN_ON_AUTO_RECORDER,
	UPDATE_ACTIONS_MODAL_STATE,
	UPDATE_ACTIONS_RECORDING_STATE,
	UPDATE_INSPECT_MODE_STATE,
	UPDATE_LAST_ELEMENT_CUSTOM_SCRIPT_OUTPUT,
	UPDATE_RECORDER_SCRIPT_BOOTED,
} from "../actions/recorder";
import { iRecorderState } from "../../interfaces/recorderReducer";
import { ACTIONS_RECORDING_STATE } from "../../interfaces/actionsRecordingState";

const initialState: iRecorderState = {
	isInspectModeOn: false,
	actionsRecordingState: {
		type: ACTIONS_RECORDING_STATE.INITIAL_STATE,
		elementInfo: null,
	},
	isAutoRecordOn: true,
	modalState: null,
	isRecorderScriptBooted: false,
	seoMetaInfo: null,
	lastElementExecutionScriptOutput: null,
};

export const recorderReducer = (state: iRecorderState = initialState, action: AnyAction) => {
	switch (action.type) {
		case UPDATE_LAST_ELEMENT_CUSTOM_SCRIPT_OUTPUT:
			return {
				...state,
				lastElementExecutionScriptOutput: action.payload.info,
			};
		case UPDATE_INSPECT_MODE_STATE:
			return {
				...state,
				isInspectModeOn: action.payload.isInspectModeOn,
			};
		case UPDATE_ACTIONS_RECORDING_STATE:
			return {
				...state,
				actionsRecordingState: {
					type: action.payload.state,
					elementInfo: action.payload.elementInfo,
				},
			};
		case UPDATE_RECORDER_SCRIPT_BOOTED:
			return {
				...state,
				isRecorderScriptBooted: action.payload.value,
			};
		case UPDATE_ACTIONS_MODAL_STATE:
			return {
				...state,
				modalState: action.payload.state,
			};
		case ADD_SEO_META_INFO:
			return {
				...state,
				seoMetaInfo: action.payload.info,
			};
		case TURN_ON_AUTO_RECORDER:
			return {
				...state,
				isAutoRecordOn: true,
			};
		case TURN_OFF_AUTO_RECORDER:
			return {
				...state,
				isAutoRecordOn: false,
			};
		default:
			return state;
	}
};

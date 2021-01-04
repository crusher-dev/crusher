import { AnyAction } from "redux";
import {
	ADD_SEO_META_INFO,
	UPDATE_ACTIONS_MODAL_STATE,
	UPDATE_ACTIONS_RECORDING_STATE,
	UPDATE_INSPECT_MODE_STATE,
	UPDATE_RECORDER_SCRIPT_BOOTED,
} from "../actions/recorder";
import { iRecorderState } from "../../interfaces/recorderReducer";
import { ACTIONS_RECORDING_STATE } from "../../interfaces/actionsRecordingState";

const initialState: iRecorderState = {
	isInspectModeOn: false,
	actionsRecordingState: {
		type: ACTIONS_RECORDING_STATE.PAGE,
		elementInfo: null,
	},
	modalState: null,
	isRecorderScriptBooted: false,
	seoMetaInfo: null,
};

export const recorderReducer = (
	state: iRecorderState = initialState,
	action: AnyAction,
) => {
	switch (action.type) {
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
		default:
			return state;
	}
};

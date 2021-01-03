import { AnyAction } from "redux";
import {
	UPDATE_ACTIONS_RECORDING_STATE,
	UPDATE_INSPECT_MODE_STATE,
} from "../actions/recorder";
import { iRecorderState } from "../../interfaces/recorderReducer";
import { ACTIONS_RECORDING_STATE } from "../../interfaces/actionsRecordingState";

const initialState: iRecorderState = {
	isInspectModeOn: false,
	actionsRecordingState: {
		type: ACTIONS_RECORDING_STATE.PAGE,
		elementInfo: null,
	},
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
			break;
		default:
			return state;
	}
};

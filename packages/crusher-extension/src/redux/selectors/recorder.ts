import { iReduxState } from "../reducers";

export const getInspectModeState = (state: iReduxState) =>
	state.recorder.isInspectModeOn;

export const getActionsRecordingState = (state: iReduxState) =>
	state.recorder.actionsRecordingState;

export const isRecorderScriptBooted = (state: iReduxState) =>
	state.recorder.isRecorderScriptBooted;

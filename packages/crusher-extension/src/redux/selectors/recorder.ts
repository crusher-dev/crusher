import { iReduxState } from "../reducers";

export const getInspectModeState = (state: iReduxState) =>
	state.recorder.isInspectModeOn;

export const getActionsRecordingState = (state: iReduxState) =>
	state.recorder.actionsRecordingState;

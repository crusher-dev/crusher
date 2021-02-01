import { iReduxState } from "../reducers";

export const getInspectModeState = (state: iReduxState) =>
	state.recorder.isInspectModeOn;

export const getActionsRecordingState = (state: iReduxState) =>
	state.recorder.actionsRecordingState;

export const isRecorderScriptBooted = (state: iReduxState) =>
	state.recorder.isRecorderScriptBooted;

export const getModalState = (state: iReduxState) => state.recorder.modalState;

export const getSeoMetaInfo = (state: iReduxState) =>
	state.recorder.seoMetaInfo;

export const getLastElementCustomScriptOutput = (state: iReduxState) =>
	state.recorder.lastElementExecutionScriptOutput;

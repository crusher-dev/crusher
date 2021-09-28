import { iReduxState } from "../reducers";

export const getInspectModeState = (state: iReduxState) => state.recorder.isInspectModeOn;

export const getActionsRecordingState = (state: iReduxState) => state.recorder.actionsRecordingState;

export const isRecorderScriptBooted = (state: iReduxState) => state.recorder.isRecorderScriptBooted;

export const getModalState = (state: iReduxState) => state.recorder.modalState;

export const getSeoMetaInfo = (state: iReduxState) => state.recorder.seoMetaInfo;

export const getLastElementCustomScriptOutput = (state: iReduxState) => state.recorder.lastElementExecutionScriptOutput;

export const getAutoRecorderState = (state: iReduxState) => state.recorder.isAutoRecordOn;

export const isRecorderOn = (state: iReduxState) => state.recorder.isRecorderOn;

export const isReplayingTest = (state: iReduxState) => state.recorder.isReplayingTest;

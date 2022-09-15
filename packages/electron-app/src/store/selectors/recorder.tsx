import { getDeviceFromId } from "../../devices";
import { iReduxState } from "../reducers";
import { TRecorderState } from "../reducers/recorder";

export const getRecorderInfo = (state: iReduxState) => ({
	url: state.recorder.currentUrl,
	device: state.recorder.device ? getDeviceFromId(state.recorder.device) : null,
});
export const getRecorderInfoUrl = (state: iReduxState) => ({
	url: state.recorder.currentUrl,
	device: state.recorder.device ? getDeviceFromId(state.recorder.device) : null,
});

export const isInspectModeOn = (state: iReduxState) => state.recorder.isInspectModeOn;
export const isInspectElementSelectorModeOn = (state: iReduxState) => state.recorder.isInspectElementSelectorModeOn;

export const getSelectedElement = (state: iReduxState) => state.recorder.selectedElement;

export const getSavedSteps = (state: iReduxState) => state.recorder.savedSteps;

export const getRecorderState = (state: iReduxState) => state.recorder.state;
export const getIsInRecordingSession = (state: iReduxState) => {
    return !!getRecorderInfo(state).device ;
}
export const getIsCustomCodeOn = (state: iReduxState) => {
	return getRecorderState(state).type === TRecorderState.CUSTOM_CODE_ON;
}

export const isTestVerified = (state: iReduxState) => state.recorder.isVerified;

export const isWebViewInitialized = (state: iReduxState) => state.recorder.isWebViewInitialized;

export const getRecorderCrashState = (state: iReduxState) => state.recorder.crashState;

export const getIsStatusBarVisible = (state: iReduxState) => state.recorder.showStatusBar;

export const getTestName = (state: iReduxState) => state.recorder.testName;

import { getDeviceFromId } from "../../devices";
import { iReduxState } from "../reducers";

export const getRecorderInfo = (state: iReduxState) => ({url: state.recorder.currentUrl, device: state.recorder.device ? getDeviceFromId(state.recorder.device) : null });

export const isInspectModeOn = (state: iReduxState) => state.recorder.isInspectModeOn;
export const getSelectedElement = (state: iReduxState) => state.recorder.selectedElement;

export const getSavedSteps = (state: iReduxState) => state.recorder.savedSteps;

export const getRecorderState = (state: iReduxState) => state.recorder.state;

export const isTestVerified = (state: iReduxState) => state.recorder.isVerified;

export const isWebViewInitialized = (state: iReduxState) => state.recorder.isWebViewInitialized;
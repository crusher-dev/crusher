import { getDeviceFromId } from "../../devices";
import { iReduxState } from "../reducers";

export const getRecorderInfo = (state: iReduxState) => ({url: state.recorder.currentUrl, device: state.recorder.device ? getDeviceFromId(state.recorder.device) : null });

export const isInspectModeOn = (state: iReduxState) => state.recorder.isInspectModeOn;
export const getSelectedElement = (state: iReduxState) => state.recorder.selectedElement;
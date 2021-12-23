import { getDeviceFromId } from "../../devices";
import { iReduxState } from "../reducers";

export const getRecorderInfo = (state: iReduxState) => ({url: state.recorder.currentUrl, device: state.recorder.device ? getDeviceFromId(state.recorder.device) : null });
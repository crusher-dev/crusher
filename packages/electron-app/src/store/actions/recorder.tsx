import { iAction } from "@shared/types/action";
import { iElementInfo, TRecorderState } from "../reducers/recorder";

export const UPDATE_RECORDER_STATE = "UPDATE_RECORDER_STATE";

export const SET_INSPECT_MODE = "SET_INSPECT_MODE_ON";
export const SET_SELECTED_ELEMENT = "SET_SELECTED_ELEMENT";

export const SET_SITE_URL = "SET_SITE_URL";
export const SET_DEVICE = "SET_DEVICE";

export const UPDATE_SETTINGS = "UPDATE_SETTINGS";
export const RECORD_STEP = "RECORD_STEP";

export const updateRecorderState = (state: TRecorderState, payload: any) => {
    return {
        type: UPDATE_RECORDER_STATE,
        payload: { state, payload },
    };
};

export const setInspectMode = (isOn: boolean) => {
    return {
        type: SET_INSPECT_MODE,
        payload: { isOn },
    };
}

export const setSelectedElement = (element: iElementInfo) => {
    return {
        type: SET_SELECTED_ELEMENT,
        payload: { element },
    }
}

export const setSiteUrl = (url: string) => {
    return {
        type: SET_SITE_URL,
        payload: { url }
    }
}

export const setDevice = (device: any) => {
    return {
        type: SET_DEVICE,
        payload: { device }
    }
}

export const recordStep = (step: iAction) => {
    return {
        type: RECORD_STEP,
        payload: { step: step, time: Date.now() }
    };
}
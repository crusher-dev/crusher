import { AnyAction } from "redux";
import { SET_DEVICE, SET_SITE_URL } from "../actions/recorder";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAction } from "@shared/types/action";

export enum TRecorderState {
	BOOTING = "BOOTING", // <- Internal state (Initialize recorder script)

	NAVIGATING = "NAVIGATING", // Don't record any actions in between the navigations
	RECORDING_ACTIONS = "RECORDING_ACTIONS",

	REPLAYING = "REPLAYING", // <- Internal State (Replay all test actions in a test)

	PERFORMING_ACTIONS = "PERFORMING_ACTIONS", 

	ACTION_REQUIRED = "ACTION_REQURED",
};

interface INavigatingStatePayload {
	url: string;
	previousUrl: string;
}

interface IRecordingActionStatePayload {
	autoDetectActions: boolean;
}

interface IReplayingStatePayload {
	externalTestId?: string;
	externalTestName?: string;

	actions: Array<iAction>;
}

interface iActionRequiredStatePayload {
	actionId: string;
};

export interface iElementInfo {
	// Unique id assigned by devtools
	uniqueElementId: string;
	// In case the element is no longer in DOM, we can still use the selector	
	selectors: Array<iSelectorInfo>;
	dependentHovers: Array<Array<iElementInfo>>;
}


export interface iSettings { 

}


interface IRecorderReducer {
	currentUrl: string | null;
	device: any | null;

	state: {type: TRecorderState, payload: INavigatingStatePayload | IRecordingActionStatePayload | IReplayingStatePayload | iActionRequiredStatePayload | null };
	isInspectModeOn: boolean;

	selectedElement: iElementInfo | null;
};

const initialState: IRecorderReducer = {
	currentUrl: null,
	device: null,

	state: { type: TRecorderState.BOOTING, payload: null },
	isInspectModeOn: false,

	selectedElement: null,
};

const recorderReducer = (state: IRecorderReducer = initialState, action: AnyAction) => {
	switch (action.type) {
		case SET_DEVICE:
			return {
				...state,
				device: action.payload.device
			}
		case SET_SITE_URL:
			return {
				...state,
				currentUrl: action.payload.url
			}
		default:
			return state;
	}
};

export {IRecorderReducer, recorderReducer};


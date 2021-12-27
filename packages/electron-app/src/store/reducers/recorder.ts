import { AnyAction } from "redux";
import { DELETE_RECORDED_STEPS, RECORD_STEP, RESET_RECORDER_STATE, SET_DEVICE, SET_INSPECT_MODE, SET_IS_TEST_VERIFIED, SET_SELECTED_ELEMENT, SET_SITE_URL, UPDATE_CURRENT_RUNNING_STEP_STATUS, UPDATE_RECORDED_STEP, UPDATE_RECORDER_STATE } from "../actions/recorder";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAction } from "@shared/types/action";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";

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
	/* In order (first one should be the origin node) */
	dependentHovers: Array<Omit<iElementInfo, "dependentHovers">>;
}


export interface iSettings { 

}

interface IRecorderReducer {
	currentUrl: string | null;
	device: any | null;

	state: {type: TRecorderState, payload: INavigatingStatePayload | IRecordingActionStatePayload | IReplayingStatePayload | iActionRequiredStatePayload | null };
	isInspectModeOn: boolean;

	selectedElement: iElementInfo | null;
	savedSteps: Array<Omit<iAction, "status"> & { status: ActionStatusEnum; time: number; }>;
	isVerified: boolean;
};

const initialState: IRecorderReducer = {
	currentUrl: null,
	device: null,

	state: { type: TRecorderState.BOOTING, payload: null },
	isInspectModeOn: false,

	selectedElement: null,
	savedSteps: [],
	isVerified: false,
};

const recorderReducer = (state: IRecorderReducer = initialState, action: AnyAction) => {
	switch (action.type) {
		case UPDATE_RECORDED_STEP: {
			const newSavedSteps = [...state.savedSteps];
			newSavedSteps[action.payload.id] = action.payload.action;
			return {
				...state,
				/* Set verified status to false, if a new step is added */
				isVerified: false,
				savedSteps: newSavedSteps
			};
		}
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
		case SET_INSPECT_MODE:
			return {
				...state,
				isInspectModeOn: action.payload.isOn
			}
		case SET_SELECTED_ELEMENT:
			return {
				...state,
				selectedElement: action.payload.element
			}
		case RECORD_STEP:
			return {
				...state,
				/* Set verified status to false, if a new step is added */
				isVerified: false,
				savedSteps: [
					...state.savedSteps,
					{
						...action.payload.step,
						status: action.payload.status,
						time: action.payload.time,
					}
				],
			}
		case UPDATE_CURRENT_RUNNING_STEP_STATUS: {
			let savedSteps = [...state.savedSteps];
			savedSteps[savedSteps.length - 1].status = action.payload.status;

			return {
				...state,
				savedSteps: savedSteps
			}
		}
		case RESET_RECORDER_STATE:
			return {
				...initialState,
				currentUrl: state.currentUrl,
				device: state.device,
			}
		case UPDATE_RECORDER_STATE:
			return {
				...state,
				state: { type: action.payload.state, payload: action.payload.payload }
			}
		case SET_IS_TEST_VERIFIED:
			return {
				...state,
				isVerified: action.payload.isTestVerified
			}
		case DELETE_RECORDED_STEPS: {
			let savedSteps = state.savedSteps.filter((step, index) => !action.payload.indexArr.includes(index));
			return {
				...state,
				savedSteps: savedSteps
			};
		}
		default:
			return state;
	}
};

export {IRecorderReducer, recorderReducer};


import { AnyAction } from "redux";
import {
	DELETE_RECORDED_STEPS,
	MARK_RECORDED_STEPS_OPTIONAL,
	RECORD_STEP,
	RESET_RECORDER,
	RESET_RECORDER_STATE,
	SET_DEVICE,
	SET_INSPECT_ELEMENT_SELECTOR_MODE,
	SET_INSPECT_MODE,
	SET_IS_TEST_VERIFIED,
	SET_IS_WEBVIEW_INITIALIZED,
	SET_RECORDER_CRASH_STATE,
	SET_RECORDER_CONTEXT,
	SET_SELECTED_ELEMENT,
	SET_SITE_URL,
	SET_STATUS_BAR_VISIBILITY,
	SET_TEST_NAME,
	UPDATE_CURRENT_RUNNING_STEP_STATUS,
	UPDATE_RECORDED_STEP,
	UPDATE_RECORDER_STATE,
} from "../actions/recorder";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAction } from "@shared/types/action";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { RESET_APP_SESSION } from "../actions/app";
import { StepErrorTypeEnum } from "runner-utils/src/error.types";

export enum TRecorderState {
	BOOTING = "BOOTING", // <- Internal state (Initialize recorder script)

	NAVIGATING = "NAVIGATING", // Don't record any actions in between the navigations
	RECORDING_ACTIONS = "RECORDING_ACTIONS",

	REPLAYING = "REPLAYING", // <- Internal State (Replay all test actions in a test)

	PERFORMING_ACTIONS = "PERFORMING_ACTIONS",
	CUSTOM_CODE_ON = "CUSTOM_CODE_ON",
	PERFORMING_RECORDER_ACTIONS = "PERFORMING_RECORDER_ACTIONS",

	ACTION_REQUIRED = "ACTION_REQURED",
}

export enum TRecorderVariant {
	CREATE_TEST = "CREATE_TEST",
	EDIT_TEST = "EDIT_TEST",
	LOCAL_BUILD = "LOCAL_BUILD",
};

export enum TRecorderCrashState {
	CRASHED = "CRASHED",
	PAGE_LOAD_FAILED = "PAGE_LOAD_FAILED",
}

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

	actions: iAction[];
}

interface iActionRequiredStatePayload {
	actionId: string;
}

export interface iElementInfo {
	// Unique id assigned by devtools
	uniqueElementId: string;
	// In case the element is no longer in DOM, we can still use the selector
	selectors: iSelectorInfo[];
	// Element Description to set default name for the actin
	elementDescription: string;
	/* In order (first one should be the origin node) */
	dependentHovers: Omit<iElementInfo, "dependentHovers">[];
}

export interface iSettings {}

interface IRecorderReducer {
	currentUrl: string | null;
	device: any | null;
	testName: string | null;
	isWebViewInitialized: boolean;

	state: {
		type: TRecorderState;
		payload: INavigatingStatePayload | IRecordingActionStatePayload | IReplayingStatePayload | iActionRequiredStatePayload | null;
	};
	crashState: { type: TRecorderCrashState; payload: any } | null;
	isInspectModeOn: any;
	elementInspectModeMeta: { isOn: boolean; stepId?: any };

	selectedElement: iElementInfo | null;
	savedSteps: Omit<iAction, "status"> & { status: ActionStatusEnum; time: number; errorType?: StepErrorTypeEnum; }[];

	isVerified: boolean;
	showStatusBar: boolean;

	context:  {
		variant: TRecorderVariant.CREATE_TEST,
		origin: "app" | 'deeplink',
		startedAt?: number, // <- Date.now()
	}
}

const initialState: IRecorderReducer = {
	currentUrl: null,
	device: null,
	isWebViewInitialized: false,

	state: { type: TRecorderState.BOOTING, payload: null },
	isInspectModeOn: false,
	elementInspectModeMeta: { isOn: false, stepId: null },
	selectedElement: null,
	savedSteps: [],
	isVerified: false,
	crashState: null,

	showStatusBar: true,
	context:  {
		variant: TRecorderVariant.CREATE_TEST,
		origin: "app",
		startedAt: Date.now()
	}
};

const recorderReducer = (state: IRecorderReducer = initialState, action: AnyAction) => {
	switch (action.type) {
		case UPDATE_RECORDED_STEP: {
			const newSavedSteps = state.savedSteps.slice();
			newSavedSteps[action.payload.id] = action.payload.action;
			return {
				...state,
				/* Set verified status to false, if a new step is added */
				isVerified: false,
				savedSteps: newSavedSteps,
			};
		}
		case SET_DEVICE:
			return {
				...state,
				device: action.payload.device,
			};
		case SET_SITE_URL:
			return {
				...state,
				currentUrl: action.payload.url,
			};
		case SET_INSPECT_MODE:
			return {
				...state,
				isInspectModeOn: action.payload,
			};
		case SET_INSPECT_ELEMENT_SELECTOR_MODE:
			return {
				...state,
				elementInspectModeMeta: { isOn: action.payload.isOn, stepId: action.payload.stepId },
			};
		case SET_SELECTED_ELEMENT:
			return {
				...state,
				selectedElement: action.payload.element,
			};
		case RECORD_STEP:
			if (action.type === ActionsInTestEnum.WAIT_FOR_NAVIGATION) {
				return state;
			}
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
					},
				],
			};
		case UPDATE_CURRENT_RUNNING_STEP_STATUS: {
			let savedSteps = state.savedSteps.slice();
			savedSteps[savedSteps.length - 1].status = action.payload.status;
			if(action.payload.status === ActionStatusEnum.FAILED) {
				savedSteps[savedSteps.length - 1].errorType = action.payload.meta.errorType;
			}

			return {
				...state,
				savedSteps: savedSteps,
			};
		}
		case SET_RECORDER_CRASH_STATE:
			return {
				...state,
				crashState: action.payload,
			};
		case RESET_RECORDER_STATE:
			return {
				...state,
				state: action.payload.state || initialState.state,
				isInspectModeOn: initialState.isInspectModeOn,

				selectedElement: initialState.isInspectModeOn,
				savedSteps: initialState.savedSteps,

				isVerified: initialState.isVerified,
			};
		case UPDATE_RECORDER_STATE:
			return {
				...state,
				state: { type: action.payload.state, payload: action.payload.payload },
			};
		case SET_IS_TEST_VERIFIED:
			return {
				...state,
				isVerified: action.payload.isTestVerified,
			};
		case DELETE_RECORDED_STEPS: {
			let savedSteps = state.savedSteps.filter((step, index) => !action.payload.indexArr.includes(index));
			return {
				...state,
				savedSteps: savedSteps,
				isVerified: false,
			};
		}
		case MARK_RECORDED_STEPS_OPTIONAL: {
			let savedSteps = state.savedSteps.map((step, index) => {
				if (action.payload.indexArr.includes(index)) {
					step.payload.isOptional = true;
				}
				return step;
			});
			return {
				...state,
				savedSteps: savedSteps,
				isVerified: false,
			};
		}
		case SET_IS_WEBVIEW_INITIALIZED:
			return {
				...state,
				isWebViewInitialized: action.payload.isInitialized,
			};
		case RESET_RECORDER:
			return initialState;
		case RESET_APP_SESSION:
			return initialState;
		case SET_STATUS_BAR_VISIBILITY:
			return {
				...state,
				showStatusBar: action.payload.isVisible,
			};
		case SET_TEST_NAME:
			return {
				...state,
				testName: action.payload.testName,
			};
		case SET_RECORDER_CONTEXT: 
			return {
				...state,
				context: action.payload.context,
			}
		default:
			return state;
	}
};

export { IRecorderReducer, recorderReducer };

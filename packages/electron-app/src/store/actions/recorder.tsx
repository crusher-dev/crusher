import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { iAction } from "@shared/types/action";
import { iElementInfo, TRecorderState, TRecorderVariant } from "../reducers/recorder";

export const UPDATE_RECORDER_STATE = "UPDATE_RECORDER_STATE";
export const SET_IS_WEBVIEW_INITIALIZED = "SET_IS_WEBVIEW_INITIALIZED";

export const SET_INSPECT_MODE = "SET_INSPECT_MODE";
export const SET_INSPECT_ELEMENT_SELECTOR_MODE = "SET_INSPECT_ELEMENT_SELECTOR_MODE";
export const SET_SELECTED_ELEMENT = "SET_SELECTED_ELEMENT";

export const SET_SITE_URL = "SET_SITE_URL";
export const SET_DEVICE = "SET_DEVICE";

export const UPDATE_SETTINGS = "UPDATE_SETTINGS";
export const RECORD_STEP = "RECORD_STEP";
export const SET_STEPS = "SET_STEPS";
export const UPDATE_CURRENT_RUNNING_STEP_STATUS = "UPDATE_CURRENT_RUNNING_STEP_STATUS";
export const UPDATE_RECORDED_STEP = "UPDATE_RECORDED_STEP";
export const RESET_RECORDER_STATE = "RESET_RECORDER_STATE";
export const SET_IS_TEST_VERIFIED = "SET_IS_TEST_VERIFIED";
export const DELETE_RECORDED_STEPS = "DELETE_RECORDED_STEPS";
export const MARK_RECORDED_STEPS_OPTIONAL = "MARK_RECORDED_STEPS_OPTIONAL";
export const RESET_RECORDER = "RESET_RECORDER";
export const SET_RECORDER_CRASH_STATE = "SET_RECORDER_CRASH_STATE";

export const SET_STATUS_BAR_VISIBILITY = "SET_STATUS_BAR_VISIBILITY";

export const SET_TEST_NAME = "SET_TEST_NAME";
export const SET_RECORDER_CONTEXT = "SET_RECORDER_CONTEXT";

export const setTestName = (testName) => {
	return {
		type: SET_TEST_NAME,
		payload: { testName },
	};
};
export const updateRecorderState = (state: TRecorderState, payload: any) => {
	return {
		type: UPDATE_RECORDER_STATE,
		payload: { state, payload },
	};
};

export const updateRecorderCrashState = (stateMeta: { state: TRecorderState; payload: any }) => {
	return {
		type: SET_RECORDER_CRASH_STATE,
		payload: stateMeta,
	};
};

export const setInspectMode = (payload: any) => {
	return {
		type: SET_INSPECT_MODE,
		payload: payload,
	};
};

export const setInspectElementSelectorMode = (isOn: boolean, stepId?: any) => {
	return {
		type: SET_INSPECT_ELEMENT_SELECTOR_MODE,
		payload: { isOn, stepId: stepId },
	};
};

export const setSelectedElement = (element: iElementInfo) => {
	return {
		type: SET_SELECTED_ELEMENT,
		payload: { element },
	};
};

export const setSiteUrl = (url: string) => {
	return {
		type: SET_SITE_URL,
		payload: { url },
	};
};

export const setDevice = (device: any) => {
	return {
		type: SET_DEVICE,
		payload: { device },
	};
};

export const recordStep = (step: iAction, status: ActionStatusEnum = ActionStatusEnum.STARTED) => {
	return {
		type: RECORD_STEP,
		payload: { step: step, time: Date.now(), status: status },
	};
};

export const updateRecordedStep = (action: iAction, id: number) => {
	return {
		type: UPDATE_RECORDED_STEP,
		payload: { action, id },
	};
};

export const setSteps = (steps: iAction[]) => {
	return {
		type: SET_STEPS,
		payload: { steps },
	};
};

export const updateCurrentRunningStepStatus = (status: ActionStatusEnum, meta: any = {}) => {
	return {
		type: UPDATE_CURRENT_RUNNING_STEP_STATUS,
		payload: { status, meta },
	};
};

export const resetRecorderState = (state: TRecorderState) => {
	return {
		type: RESET_RECORDER_STATE,
		payload: { state: state },
	};
};

export const resetRecorder = () => {
	return {
		type: RESET_RECORDER,
	};
};

export const deleteRecordedSteps = (indexArr) => {
	return {
		type: DELETE_RECORDED_STEPS,
		payload: { indexArr },
	};
};

export const markRecordedStepsOptional = (indexArr) => {
	return {
		type: MARK_RECORDED_STEPS_OPTIONAL,
		payload: { indexArr },
	};
};

export const setIsTestVerified = (isVerified: boolean) => {
	return {
		type: SET_IS_TEST_VERIFIED,
		payload: { isTestVerified: isVerified },
	};
};

export const setIsWebViewInitialized = (isInitialized: boolean) => {
	return {
		type: SET_IS_WEBVIEW_INITIALIZED,
		payload: { isInitialized },
	};
};

export const setStatusBarVisibility = (isVisible: boolean) => {
	return {
		type: SET_STATUS_BAR_VISIBILITY,
		payload: { isVisible },
	};
};

export const setRecorderContext = (context: {} | {variant: TRecorderVariant; origin?: "deeplink" | "app" | null } ) => {
	if(context) {
		(context as any).startedAt = Date.now();
	}
	return {
		type: SET_RECORDER_CONTEXT,
		payload: { context }
	}
};

import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { ActionDescriptor } from "runner-utils/src/functions/actionDescriptor";
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
export const isInspectElementSelectorModeOn = (state: iReduxState) => state.recorder.elementInspectModeMeta?.isOn;
export const getInspectElementSelectorMeta = (state: iReduxState) => state.recorder.elementInspectModeMeta;

export const getSelectedElement = (state: iReduxState) => state.recorder.selectedElement;

export const getSavedSteps = (state: iReduxState) => state.recorder.savedSteps;
export const getAllSteps = (state: iReduxState) => state.recorder.savedSteps.concat(state.app.sessionMeta?.remainingSteps ? state.app.sessionMeta.remainingSteps : []);
export const getStepInfo = (stepId: any) => {
	return (state: iReduxState) => {
		const step = getAllSteps(state)[stepId];
		const selectors = step.payload?.selectors?.length ? step.payload.selectors[0].value : null;

		const actionDescriptor = new ActionDescriptor();
		actionDescriptor.initActionHandlers();
		const stepName = step.name || actionDescriptor.describeAction(step as any);

		return {
			isRunning: step.status === ActionStatusEnum.STARTED,
			isCompleted: step.status === ActionStatusEnum.COMPLETED,
			isFailed: step.status === ActionStatusEnum.FAILED,
			hasCustomName: !!step.name,
			name: stepName,
			actionDescription: actionDescriptor.describeAction(step as any),
			description: selectors,
			step: step,
		};
	};
};
export const getRecorderState = (state: iReduxState) => state.recorder.state;
export const getIsInRecordingSession = (state: iReduxState) => {
	return !!getRecorderInfo(state).device;
};
export const getIsCustomCodeOn = (state: iReduxState) => {
	return getRecorderState(state).type === TRecorderState.CUSTOM_CODE_ON;
};

export const isTestVerified = (state: iReduxState) => state.recorder.isVerified;

export const isWebViewInitialized = (state: iReduxState) => state.recorder.isWebViewInitialized;

export const getRecorderCrashState = (state: iReduxState) => state.recorder.crashState;

export const getIsStatusBarVisible = (state: iReduxState) => state.recorder.showStatusBar;

export const getTestName = (state: iReduxState) => state.recorder.testName;

export const getRecorderContext = (state: iReduxState) => state.recorder.context;

// In ms
export const getTotalTimeSpentInRecorder = (state: iReduxState) => {
	const currentTime = Date.now();
	const recorderContext = getRecorderContext(state);
	return {
		totalTime: currentTime - recorderContext.startedAt,
	}
}
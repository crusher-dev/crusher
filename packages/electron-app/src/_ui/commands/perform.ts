import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { iAction } from "@shared/types/action";
import { iDevice } from "@shared/types/extension/device";
import { ipcRenderer } from "electron";
import { recordStep } from "electron-app/src/store/actions/recorder";
import { iElementInfo } from "electron-app/src/store/reducers/recorder";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { AnyAction, Store } from "redux";
import { showToast } from "../ui/components/toasts";

const performAction = (action: iAction, shouldNotSave = false, isRecording = true) => {
	return ipcRenderer.invoke("perform-action", { action, shouldNotSave, isRecording });
};

const performNavigation = (url: string) => {
	return performAction({
		type: ActionsInTestEnum.NAVIGATE_URL,
		payload: {
			selectors: [],
			meta: {
				value: url,
			},
		},
	});
};

const performTakePageScreenshot = async () => {
	await performAction({
		type: ActionsInTestEnum.PAGE_SCREENSHOT,
		payload: {},
	});
};

const recordHoverDependencies = async (selectedElement: iElementInfo) => {
	for (const depedentHover of selectedElement.dependentHovers) {
		await registerActionAsSavedStep({
			type: ActionsInTestEnum.HOVER,
			payload: {
				selectors: depedentHover.selectors,
				meta: {
					uniqueNodeId: selectedElement.uniqueElementId,
				},
			},
		});
	}
};

// @TODO: Find a better way for thios
const saveSetDeviceIfNotThere = (device: any, store: Store<unknown, AnyAction>) => {
	const savedSteps = getSavedSteps(store.getState() as any);
	const setDeviceAction = savedSteps.find((step) => step.type === ActionsInTestEnum.SET_DEVICE);

	if (!setDeviceAction) {
		store.dispatch(
			recordStep(
				{
					type: ActionsInTestEnum.SET_DEVICE,
					payload: {
						meta: {
							device: device,
						},
					},
				},
				ActionStatusEnum.COMPLETED,
			),
		);
	}
};

const peformTakeElementScreenshot = async (selectedElement: iElementInfo) => {
	await recordHoverDependencies(selectedElement);

	await performAction({
		type: ActionsInTestEnum.ELEMENT_SCREENSHOT,
		payload: {
			selectors: selectedElement.selectors,
			meta: {
				uniqueNodeId: selectedElement.uniqueElementId,
			},
		},
	});
};

const performClick = async (selectedElement: iElementInfo) => {
	await recordHoverDependencies(selectedElement);

	await performAction(
		{
			type: ActionsInTestEnum.CLICK,
			payload: {
				selectors: selectedElement.selectors,
				meta: {
					uniqueNodeId: selectedElement.uniqueElementId,
				},
			},
		},
		false,
	);
};

const performHover = async (selectedElement: iElementInfo) => {
	await recordHoverDependencies(selectedElement);

	await performAction({
		type: ActionsInTestEnum.HOVER,
		payload: {
			selectors: selectedElement.selectors,
			meta: {
				uniqueNodeId: selectedElement.uniqueElementId,
			},
		},
	});
};

const performRunAfterTest = async (testId: string) => {
	await performAction(
		{
			type: ActionsInTestEnum.RUN_AFTER_TEST,
			payload: {
				meta: {
					value: testId,
				},
			},
		},
		true,
	);
};

const performCustomCode = async (code: string, templateId: string | null) => {
	await performAction({
		type: ActionsInTestEnum.CUSTOM_CODE,
		payload: {
			selectors: null,
			meta: {
				templateId,
				script: code,
			},
		},
	});
};

export const performAssertElementVisibility = async (selectedElement: iElementInfo) => {
	await registerActionAsSavedStep({
		type: ActionsInTestEnum.ASSERT_ELEMENT_VISIBILITY,
		payload: {
			selectors: selectedElement.selectors,
			meta: {
				uniqueNodeId: selectedElement.uniqueElementId,
			},
		},
	});
};

const performVerifyTest = (shouldAlsoSave = true, autoSaveType: "UPDATE" | "SAVE" = "SAVE", shouldNotRunTest = true) => {
	return ipcRenderer.invoke("verify-test", { shouldAlsoSave, autoSaveType, shouldNotRunTest }).then((res) => {
		if(shouldNotRunTest)
		showToast({
			type: "ready-for-edit",
			isUnique: true,
			message: "All steps completed, you can edit now",
		});

		return res;
	});
};

const performRunTests = (testIds) => {
	return ipcRenderer.invoke("run-tests", { testIds });
};

const performResetAppSession = () => {
	ipcRenderer.invoke("reset-app-session");
};

const performReplayTest = (testId) => {
	return ipcRenderer.invoke("replay-test", { testId });
};

const performClearRemainingStpes = () => {
	return ipcRenderer.invoke("clear-remaining-steps");
};

const performReplayTestUrlAction = (testId, redirectAfterSuccess = false, selectedTests = []) => {
	return ipcRenderer.invoke("replay-test-url-action", { testId, redirectAfterSuccess, selectedTests });
};

const turnOnInspectMode = (meta) => {
	ipcRenderer.invoke("turn-on-recorder-inspect-mode", { meta });
};

const turnOnElementSelectorInspectMode = (payload: { stepId?: any }) => {
	return ipcRenderer.invoke("turn-on-element-selector-inspect-mode", payload);
};

const turnOffInspectMode = () => {
	ipcRenderer.invoke("turn-off-recorder-inspect-mode");
};

const enableJavascriptInDebugger = () => {
	return ipcRenderer.invoke("enable-javascript-in-debugger");
};

const disableJavascriptInDebugger = () => {
	return ipcRenderer.invoke("disable-javascript-in-debugger");
};

const turnOffElementSelectorInspectMode = () => {
	return ipcRenderer.invoke("turn-off-element-selector-inspect-mode");
};

const updateTestName = (testId, testName) => {
	return ipcRenderer.invoke("update-cloud-test-name", { testId, testName });
};

const saveTest = (shouldNotRunTest: boolean = false) => {
	return ipcRenderer.invoke("save-test", { shouldNotRunTest });
};

const updateTest = () => {
	return ipcRenderer.invoke("update-test");
};

const preformGoBackPage = () => {
	ipcRenderer.invoke("go-back-page");
};

const performReloadPage = () => {
	ipcRenderer.invoke("reload-page");
};

const resetStorage = () => {
	ipcRenderer.invoke("reset-storage");
};

const continueRemainingSteps = (extraSteps?: iAction[]) => {
	ipcRenderer.invoke("continue-remaining-steps", { extraSteps });
};

const registerActionAsSavedStep = (action) => {
	ipcRenderer.invoke("save-step", { action });
};

const resetTest = (device: iDevice) => {
	ipcRenderer.invoke("reset-test", { device });
};

const performDeleteTest = (testId: string) => {
	return ipcRenderer.invoke("delete-test", { testId });
};

const focusOnWindow = () => {
	ipcRenderer.invoke("focus-window");
};

const saveAndGetUserInfo = (token: string) => {
	return ipcRenderer.invoke("save-n-get-user-info", { token });
};

const getUserTests = (projectId) => {
	return ipcRenderer.invoke("get-user-tests", { projectId });
};

const getBuildReport = (buildId) => {
	return ipcRenderer.invoke("get-build-report", { buildId });
};

const getCloudUserInfo = () => {
	return ipcRenderer.invoke("get-cloud-user-info");
};

const performJumpTo = (stepIndex) => {
	return ipcRenderer.invoke("jump-to-step", { stepIndex });
};

const goFullScreen = (fullScreen: boolean = true) => {
	return ipcRenderer.invoke("go-full-screen", { fullScreen });
};

const performQuitAndRestore = (store) => {
	const savedSteps = getSavedSteps(store.getState());
	window.localStorage.setItem("saved-steps", JSON.stringify(savedSteps));
	return ipcRenderer.invoke("quit-and-restore");
};

const performSteps = (steps) => {
	return ipcRenderer.invoke("perform-steps", { steps });
};

const getCodeTemplates = () => {
	return ipcRenderer.invoke("get-code-templates", {});
};

const saveCodeTemplate = (payload) => {
	return ipcRenderer.invoke("save-code-template", { createPayload: payload });
};

const updateCodeTemplate = (id, name, code) => {
	return ipcRenderer.invoke("update-code-template", { id, name, code });
};
const deleteCodeTemplate = (id) => {
	return ipcRenderer.invoke("delete-code-template", { id });
};

const performExit = () => {
	return ipcRenderer.invoke("exit-app");
};

const performUndockCode = (stepIndex) => {
	return ipcRenderer.invoke("undock-code", {stepIndex});
};

const turnOnProxy = (configFilePath) => {
	return ipcRenderer.invoke("turn-on-proxy", { configFilePath });
};

const performRunDraftTest = (testId) => {
	return ipcRenderer.invoke("run-draft-test", { testId });
};

const performSaveLocalBuild = (tests) => {
	return ipcRenderer.invoke("save-local-build", { tests });
};

const performGetRecorderTestLogs = () => {
	return ipcRenderer.invoke("get-recorder-test-logs", {});
};

const performCreateCloudProject = (projectName: string) => {
	return ipcRenderer.invoke("create-cloud-project", { name: projectName });
};

const performGoToUrl = (url: string) => {
	return ipcRenderer.invoke("goto-url", { url: url });
};

const turnOnWebviewDevTools = () => {
	return ipcRenderer.invoke("turn-on-webview-dev-tools", {});
};

const performPauseStepsExecution = () => {
	return ipcRenderer.invoke("pause-steps", {});
};

export {
	recordHoverDependencies,
	performAction,
	performSetDevice,
	saveSetDeviceIfNotThere,
	performNavigation,
	performTakePageScreenshot,
	turnOnInspectMode,
	turnOffInspectMode,
	performClick,
	performHover,
	peformTakeElementScreenshot,
	performRunAfterTest,
	performCustomCode,
	performVerifyTest,
	saveTest,
	preformGoBackPage,
	performReloadPage,
	performReplayTest,
	updateTest,
	resetStorage,
	continueRemainingSteps,
	registerActionAsSavedStep,
	resetTest,
	focusOnWindow,
	saveAndGetUserInfo,
	getUserTests,
	turnOnElementSelectorInspectMode,
	turnOffElementSelectorInspectMode,
	performResetAppSession,
	performJumpTo,
	performQuitAndRestore,
	performSteps,
	enableJavascriptInDebugger,
	disableJavascriptInDebugger,
	getCodeTemplates,
	saveCodeTemplate,
	updateCodeTemplate,
	deleteCodeTemplate,
	performReplayTestUrlAction,
	goFullScreen,
	getCloudUserInfo,
	getBuildReport,
	updateTestName,
	performRunTests,
	performClearRemainingStpes,
	performDeleteTest,
	performExit,
	performUndockCode,
	turnOnProxy,
	performRunDraftTest,
	performGetRecorderTestLogs,
	performSaveLocalBuild,
	performCreateCloudProject,
	performGoToUrl,
	turnOnWebviewDevTools,
	performPauseStepsExecution
};

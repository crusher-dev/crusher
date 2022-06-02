import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { iAction } from "@shared/types/action";
import { iDevice } from "@shared/types/extension/device";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { ipcRenderer } from "electron";
import { deleteRecordedSteps, recordStep, updateRecorderState } from "electron-app/src/store/actions/recorder";
import { iElementInfo, TRecorderState } from "electron-app/src/store/reducers/recorder";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import { AnyAction, Store } from "redux";

const performAction = async (action: iAction, shouldNotSave = false, isRecording = true) => {
	return ipcRenderer.invoke("perform-action", { action, shouldNotSave, isRecording });
};

const performSetDevice = async (device: iDevice) => {
	return performAction({
		type: ActionsInTestEnum.SET_DEVICE,
		payload: {
			meta: {
				device: {
					...device,
				},
			},
		},
	});
};

const performNavigation = async (url: string, store: Store<unknown, AnyAction>) => {
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
							device: {
								...device,
							},
						},
					},
				},
				ActionStatusEnum.COMPLETED,
			),
		);
	}
};

const peformTakeElementScreenshot = async (selectedElement: iElementInfo, store: Store<unknown, AnyAction>) => {
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

const performHover = async (selectedElement: iElementInfo, store: Store<unknown, AnyAction>) => {
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

export const performAssertElementVisibility = async (selectedElement: iElementInfo, store: Store<unknown, AnyAction>) => {
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

const performVerifyTest = async (shouldAlsoSave = true) => {
	return ipcRenderer.invoke("verify-test", { shouldAlsoSave });
};

const performRunTests = async (projectId, testIds) => {
	return ipcRenderer.invoke("run-tests", { projectId, testIds });
}

const performResetAppSession = async () => {
	ipcRenderer.invoke("reset-app-session");
}

const performReplayTest = async (testId) => {
	return ipcRenderer.invoke("replay-test", { testId });
};


const performReplayTestUrlAction = async (testId, redirectAfterSuccess = false) => {
	return ipcRenderer.invoke("replay-test-url-action", { testId, redirectAfterSuccess });
};

const turnOnInspectMode = () => {
	ipcRenderer.invoke("turn-on-recorder-inspect-mode");
};

const turnOnElementSelectorInspectMode = () => {
	return ipcRenderer.invoke("turn-on-element-selector-inspect-mode");
}

const turnOffInspectMode = () => {
	ipcRenderer.invoke("turn-off-recorder-inspect-mode");
};

const enableJavascriptInDebugger = () => {
	return ipcRenderer.invoke("enable-javascript-in-debugger");
}

const disableJavascriptInDebugger = () => {
	return ipcRenderer.invoke("disable-javascript-in-debugger");
}

const turnOffElementSelectorInspectMode = () => {
	return ipcRenderer.invoke("turn-off-element-selector-inspect-mode");
}


const updateTestName =(testId, testName) => {
	return ipcRenderer.invoke("update-cloud-test-name", {testId, testName});
}

const saveTest = () => {
	return ipcRenderer.invoke("save-test");
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

const continueRemainingSteps = (extraSteps?: Array<iAction>) => {
	ipcRenderer.invoke("continue-remaining-steps", { extraSteps });
};

const registerActionAsSavedStep = (action) => {
	ipcRenderer.invoke("save-step", { action });
};

const resetTest = (device: iDevice) => {
	ipcRenderer.invoke("reset-test", { device });
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
}

const getCloudUserInfo = () => {
	return ipcRenderer.invoke("get-cloud-user-info");
}

const performJumpTo = (stepIndex) => {
	return ipcRenderer.invoke("jump-to-step", {stepIndex});
}

const goFullScreen = (fullScreen: boolean = true) => {
	return ipcRenderer.invoke("go-full-screen", { fullScreen });
}

const performQuitAndRestore = (store) => {
	const savedSteps = getSavedSteps(store.getState());
	window.localStorage.setItem("saved-steps", JSON.stringify(savedSteps));
	return ipcRenderer.invoke("quit-and-restore");
}

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
	performRunTests
};

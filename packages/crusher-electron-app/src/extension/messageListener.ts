import { getStore } from "./redux/store";
import { recordAction, updateLastRecordedAction } from "./redux/actions/actions";
import {
	addSEOMetaInfo,
	updateActionsRecordingState,
	updateInspectModeState,
	updateIsRecorderScriptBooted,
	updateLastElementCustomScriptOutput,
} from "./redux/actions/recorder";
import { ACTIONS_RECORDING_STATE } from "./interfaces/actionsRecordingState";
import { RefObject } from "react";
import { getActionsRecordingState, getAutoRecorderState, isRecorderScriptBooted } from "./redux/selectors/recorder";
import { AdvancedURL } from "./utils/url";
import userAgents from "@shared/constants/userAgents";
import {
	FRAME_MESSAGE_TYPES,
	iExecuteScriptOutputResponseMeta,
	iExecuteScriptResponseMeta,
	iInspectModeUpdateMeta,
	iPerformActionMeta,
} from "./scripts/inject/responseMessageListener";
import { TOP_LEVEL_ACTION } from "./interfaces/topLevelAction";
import { ELEMENT_LEVEL_ACTION } from "./interfaces/elementLevelAction";
import { ACTIONS_IN_TEST } from "@shared/constants/recordedActions";
import { getActions } from "./redux/selectors/actions";
import { iPageSeoMeta } from "./utils/dom";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAttribute } from "@shared/types/elementInfo";
import { iAction } from "@shared/types/action";

export enum MESSAGE_TYPES {
	RECORD_ACTION_META = "RECORD_ACTION_META",
	RECORD_ACTION = "RECORD_ACTION",
	UPDATE_INSPECTOR_MODE_STATE = "UPDATE_INSPECTOR_MODE_STATE",
	TURN_ON_ELEMENT_MODE = "TURN_ON_ELEMENT_MODE",
	TURN_OFF_ELEMENT_MODE = "TURN_OFF_ELEMENT_MODE",
	RECORDER_BOOTED = "RECORDER_BOOTED",
	REQUEST_RECORDING_STATUS = "REQUEST_RECORDING_STATUS",
	REQUEST_USER_AGENT = "REQUEST_USER_AGENT",
	SEO_META_INFORMATION = "SEO_META_INFORMATION",
	EXECUTE_CUSTOM_SCRIPT_OUTPUT = "EXECUTE_CUSTOM_SCRIPT_OUTPUT",
	RELOAD_ELECTRON_EXTENSION = "RELOAD_ELECTRON_EXTENSION",
}

export enum RECORDING_STATUS {
	INSPECTOR_MODE_ON = "INSPECTOR_MODE_ON",
	INSPECTOR_MODE_OFF = "INSPECTOR_MODE_OFF",
	RECORDER_SCRIPT_NOT_BOOTED = "RECORDER_SCRIPT_NOT_BOOTED",
}

export interface iMessage {
	type: MESSAGE_TYPES | FRAME_MESSAGE_TYPES;
	meta: any;
}

interface iUpdateInspectorMessageMeta {
	value: boolean;
}

export interface iElementModeMessageMeta {
	selectors: Array<iSelectorInfo>;
	attributes: Array<iAttribute>;
	innerHTML: string;
}

export interface iSeoMetaInformationMeta {
	title: string;
	metaTags: iPageSeoMeta;
}

function handleRecordAction(action: iAction): any {
	const store = getStore();
	const recordedActions = getActions(store.getState());
	const lastRecordedAction = recordedActions.length ? recordedActions[recordedActions.length - 1] : null;

	const { type } = action;

	// We can assume any event coming to this is auto-based
	const shouldAutoRecord = getAutoRecorderState(store.getState());
	if (!shouldAutoRecord && ![ACTIONS_IN_TEST.NAVIGATE_URL, ACTIONS_IN_TEST.SCROLL, ACTIONS_IN_TEST.SET_DEVICE].includes(type)) {
		return;
	}

	switch (type) {
		case ACTIONS_IN_TEST.NAVIGATE_URL: {
			const hasInitialNavigationActionRegistered =
				recordedActions.findIndex((recordedAction) => recordedAction.type === ACTIONS_IN_TEST.NAVIGATE_URL) !== -1;

			const isLastEventWaitForNavigation = lastRecordedAction && lastRecordedAction!.type !== ACTIONS_IN_TEST.WAIT_FOR_NAVIGATION;

			if (!hasInitialNavigationActionRegistered) {
				store.dispatch(recordAction(action));
			} else {
				if (isLastEventWaitForNavigation) {
					store.dispatch(recordAction({ ...action, type: ACTIONS_IN_TEST.WAIT_FOR_NAVIGATION }));
				}
			}
			store.dispatch(updateIsRecorderScriptBooted(false));
			break;
		}
		case ACTIONS_IN_TEST.ADD_INPUT: {
			if (!lastRecordedAction) throw new Error("Add input recorded before navigate url");

			const isLastEventAddInput = lastRecordedAction.type === ACTIONS_IN_TEST.ADD_INPUT;
			if (!isLastEventAddInput) {
				action.payload.meta.value = [action.payload.meta.value];
				store.dispatch(recordAction(action));
				return false;
			}

			const currentXpath = action.payload.selectors!.find((selector) => selector.type === "xpath");

			const lastActionXpath = lastRecordedAction.payload.selectors!.find((selector) => selector.type === "xpath");

			// Store add inputs in an array values
			if (!(isLastEventAddInput && currentXpath!.value === lastActionXpath!.value)) {
				action.payload.meta.value = [action.payload.meta.value];
				store.dispatch(recordAction(action));
			} else {
				action.payload.meta.value = [...lastRecordedAction.payload.meta.value, action.payload.meta.value];
				store.dispatch(updateLastRecordedAction(action));
			}

			break;
		}
		case ACTIONS_IN_TEST.SCROLL: {
			if (!lastRecordedAction) throw new Error("Scroll recorded before navigate url");

			const isScrollingToSameLastElement =
				lastRecordedAction.type === ACTIONS_IN_TEST.SCROLL &&
				((lastRecordedAction.payload.selectors === null && action.payload.selectors === null) ||
					(lastRecordedAction.payload.selectors as iSelectorInfo[])[0].value === (action.payload.selectors as iSelectorInfo[])[0].value);

			// Store add inputs in an array values
			if (!isScrollingToSameLastElement) {
				action.payload.meta.value = [action.payload.meta.value];
				store.dispatch(recordAction(action));
			} else {
				action.payload.meta.value = [...lastRecordedAction.payload.meta.value, action.payload.meta.value];
				store.dispatch(updateLastRecordedAction(action));
			}
			break;
		}
		case ACTIONS_IN_TEST.HOVER: {
			if (!lastRecordedAction) throw new Error("Hover recorded before navigate url");

			const isTheLastRecordedActionSame =
				lastRecordedAction.type === ACTIONS_IN_TEST.HOVER &&
				(lastRecordedAction.payload.selectors as iSelectorInfo[])[0].value === (action.payload.selectors as iSelectorInfo[])[0].value;

			if (!isTheLastRecordedActionSame) {
				store.dispatch(recordAction(action));
			}
			break;
		}
		case ACTIONS_IN_TEST.CLICK: {
			if (!lastRecordedAction) throw new Error("Click recorded before navigate url");

			const isTheLastRecordedActionOnSameElementFocus =
				lastRecordedAction.type === ACTIONS_IN_TEST.ELEMENT_FOCUS &&
				(lastRecordedAction.payload.selectors as iSelectorInfo[])[0].value === (action.payload.selectors as iSelectorInfo[])[0].value;
			if (!isTheLastRecordedActionOnSameElementFocus) {
				store.dispatch(recordAction(action));
			}
			break;
		}
		default:
			store.dispatch(recordAction(action));
			break;
	}

	return true;
}

function sendTestRecorderStatusToFrame(webviewRef: RefObject<HTMLWebViewElement>) {
	const store = getStore();

	if (!webviewRef.current) throw new Error("Webview not available yet from ref context");

	const inUsingInspectorMode = getActionsRecordingState(store.getState()).type === ACTIONS_RECORDING_STATE.ELEMENT;

	const isRecording = isRecorderScriptBooted(store.getState());

	(window as any).electron.webview.postMessage({
		type: FRAME_MESSAGE_TYPES.RECORDING_STATUS_REQUEST_RESPONSE,
		meta: {
			value: inUsingInspectorMode
				? RECORDING_STATUS.INSPECTOR_MODE_ON
				: isRecording
				? RECORDING_STATUS.INSPECTOR_MODE_OFF
				: RECORDING_STATUS.RECORDER_SCRIPT_NOT_BOOTED,
		},
	});
}

function sendUserAgentToFrame(webviewRef: RefObject<HTMLWebViewElement>) {
	if (!webviewRef.current) throw new Error("Webview not available yet from ref context");

	// Extension url contains selected device
	const device = AdvancedURL.getDeviceFromCrusherExtensionUrl(window?.location.href);
	const userAgent = userAgents.find((agent) => agent.name === (device.userAgent || userAgents[0].value));
	(window as any).electron.webview.postMessage({
		type: FRAME_MESSAGE_TYPES.USER_AGENT_REQUEST_RESPONSE,
		meta: { value: userAgent },
	});
}

export function recorderMessageListener(webviewRef: RefObject<HTMLWebViewElement>, event: MessageEvent<iMessage>) {
	const store = getStore();

	const { type } = event.data;

	switch (type) {
		case MESSAGE_TYPES.RECORD_ACTION_META: {
			const metaArr = event.data.meta.finalActions as Array<iAction>;
			for (let i = 0; i < metaArr.length; i++) {
				handleRecordAction(metaArr[i]);
			}
			break;
		}
		case MESSAGE_TYPES.RECORD_ACTION: {
			const meta = event.data.meta as iAction;
			handleRecordAction(meta);
			break;
		}
		case MESSAGE_TYPES.UPDATE_INSPECTOR_MODE_STATE: {
			const meta = event.data.meta as iUpdateInspectorMessageMeta;
			const isInspectModeOn = meta.value;
			store.dispatch(updateInspectModeState(isInspectModeOn));
			if (isInspectModeOn) {
				(window as any).electron.turnOnInspectMode();

				store.dispatch(updateActionsRecordingState(ACTIONS_RECORDING_STATE.SELECT_ELEMENT));
			} else {
				store.dispatch(updateActionsRecordingState(ACTIONS_RECORDING_STATE.PAGE));
			}
			break;
		}
		case MESSAGE_TYPES.TURN_ON_ELEMENT_MODE: {
			const meta = event.data.meta as iElementModeMessageMeta;
			store.dispatch(updateActionsRecordingState(ACTIONS_RECORDING_STATE.ELEMENT, meta));
			break;
		}
		case MESSAGE_TYPES.RECORDER_BOOTED: {
			store.dispatch(updateIsRecorderScriptBooted(true));
			break;
		}
		case MESSAGE_TYPES.REQUEST_RECORDING_STATUS: {
			sendTestRecorderStatusToFrame(webviewRef);
			break;
		}
		case MESSAGE_TYPES.REQUEST_USER_AGENT: {
			sendUserAgentToFrame(webviewRef);
			break;
		}
		case MESSAGE_TYPES.RELOAD_ELECTRON_EXTENSION: {
			if (!(window as any).electron) {
				throw new Error("This should be only hit from inside the electron");
			}

			(window as any).electron.reloadExtension();
			break;
		}
		case MESSAGE_TYPES.SEO_META_INFORMATION: {
			const meta = event.data.meta as iSeoMetaInformationMeta;
			store.dispatch(addSEOMetaInfo(meta));
			break;
		}
		case MESSAGE_TYPES.EXECUTE_CUSTOM_SCRIPT_OUTPUT: {
			const meta = event.data.meta as iExecuteScriptOutputResponseMeta;
			store.dispatch(updateLastElementCustomScriptOutput(meta));
			break;
		}
		default:
			console.debug("Unknown Message type");
			break;
	}

	return true;
}

export function turnOnInspectModeInFrame(webviewRef: RefObject<HTMLWebViewElement>) {
	if (!webviewRef.current) throw new Error("Webview not available yet from ref context");

	(window as any).electron.webview.postMessage({
		type: FRAME_MESSAGE_TYPES.UPDATE_INSPECT_MODE_STATE,
		meta: { isInspectModeOn: true } as iInspectModeUpdateMeta,
	});
}

export function turnOffInspectModeInFrame(webviewRef: RefObject<HTMLWebViewElement>) {
	if (!webviewRef.current) throw new Error("Webview not available yet from ref context");

	(window as any).electron.turnOffInspectMode();

	(window as any).electron.webview.postMessage({
		type: FRAME_MESSAGE_TYPES.UPDATE_INSPECT_MODE_STATE,
		meta: { isInspectModeOn: false } as iInspectModeUpdateMeta,
	});
}

export function executeScriptInFrame(script: string, selector: string, webviewRef: RefObject<HTMLWebViewElement>) {
	if (!webviewRef.current) throw new Error("Webview not available yet from ref context");

	(window as any).electron.webview.postMessage({
		type: FRAME_MESSAGE_TYPES.EXECUTE_ELEMENT_CUSTOM_SCRIPT,
		meta: { script: script, selector: selector } as iExecuteScriptResponseMeta,
	});
}

export function performActionInFrame(
	actionType: TOP_LEVEL_ACTION | ELEMENT_LEVEL_ACTION,
	recordingState: ACTIONS_RECORDING_STATE,
	webViewRef: RefObject<HTMLWebViewElement>,
) {
	if (!webViewRef.current) throw new Error("Webview not available yet from ref context");

	(window as any).electron.webview.postMessage({
		type: FRAME_MESSAGE_TYPES.PERFORM_ACTION,
		meta: { type: actionType, recordingState } as iPerformActionMeta,
	});
}

import { getStore } from "./redux/store";
import { deleteRecordedAction, recordAction, resetRecordedActions, updateLastRecordedAction, updateLastRecordedActionStatus } from "./redux/actions/actions";
import {
	addSEOMetaInfo,
	setIsTestReplaying,
	updateActionsRecordingState,
	updateInspectModeState,
	updateIsRecorderScriptBooted,
	updateLastElementCustomScriptOutput,
} from "./redux/actions/recorder";
import { ACTIONS_RECORDING_STATE } from "./interfaces/actionsRecordingState";
import { RefObject } from "react";
import { getActionsRecordingState, getAutoRecorderState, isRecorderOn, isRecorderScriptBooted } from "./redux/selectors/recorder";
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
import { ActionsInTestEnum, InputNodeTypeEnum } from "@shared/constants/recordedActions";
import { getActions } from "./redux/selectors/actions";
import { iPageSeoMeta } from "./utils/dom";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAttribute } from "@shared/types/elementInfo";
import { iAction } from "@shared/types/action";
import { saveTest } from "./utils/app";

export enum MESSAGE_TYPES {
	RECORD_ACTION_META = "RECORD_ACTION_META",
	UPDATE_LAST_RECORDED_ACTION_STATUS = "UPDATE_LAST_RECORDED_ACTION_STATUS",
	RECORD_REPLAY_ACTION = "RECORD_REPLAY_ACTION",
	RECORD_ACTION = "RECORD_ACTION",
	CLEAR_RECORDED_ACTIONS = "CLEAR_RECORDED_ACTIONS",
	SET_IS_VERIFYING_STATE = "SET_IS_VERIFYING_STATE",
	SET_IS_REPLAYING = "SET_IS_REPLAYING",
	UPDATE_INSPECTOR_MODE_STATE = "UPDATE_INSPECTOR_MODE_STATE",
	TURN_ON_ELEMENT_MODE = "TURN_ON_ELEMENT_MODE",
	TURN_OFF_ELEMENT_MODE = "TURN_OFF_ELEMENT_MODE",
	RECORDER_BOOTED = "RECORDER_BOOTED",
	REQUEST_RECORDING_STATUS = "REQUEST_RECORDING_STATUS",
	REQUEST_USER_AGENT = "REQUEST_USER_AGENT",
	SEO_META_INFORMATION = "SEO_META_INFORMATION",
	EXECUTE_CUSTOM_SCRIPT_OUTPUT = "EXECUTE_CUSTOM_SCRIPT_OUTPUT",
	RELOAD_ELECTRON_EXTENSION = "RELOAD_ELECTRON_EXTENSION",
	SAVE_RECORDED_TEST = "SAVE_RECORDED_TEST",
	DELETE_LAST_ACTION = "DELETE_LAST_ACTION",
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

async function areTwoNodesSame(firstAction: iAction, secondAction: iAction) {
	const firstUniqueId = await (window as any).electron.getNodeId(firstAction.payload.meta.uniqueNodeId);
	const secondUniqueId = await (window as any).electron.getNodeId(secondAction.payload.meta.uniqueNodeId);

	return firstUniqueId !== -1 && secondUniqueId !== -1 && firstUniqueId === secondUniqueId;
}

async function checkIfLabelIdIncludesCurrent(lastAction: iAction, currentAction: iAction) {
	const finalArrPromise = currentAction.payload.meta.value.labelsUniqId.map((id) => {
		return (window as any).electron.getNodeId(id);
	});
	const finalArr = await Promise.all(finalArrPromise);

	return finalArr.includes(await (window as any).electron.getNodeId(lastAction.payload.meta.uniqueNodeId));
}

async function handleRecordAction(action: iAction): any {
	const store = getStore();
	if (!isRecorderOn(store.getState())) {
		return;
	}

	const recordedActions = getActions(store.getState());
	const lastRecordedAction = recordedActions.length ? recordedActions[recordedActions.length - 1] : null;

	const { type } = action;

	// We can assume any event coming to this is auto-based
	const shouldAutoRecord = getAutoRecorderState(store.getState());
	if (
		!shouldAutoRecord &&
		![ActionsInTestEnum.NAVIGATE_URL, ActionsInTestEnum.PAGE_SCROLL, ActionsInTestEnum.ELEMENT_SCROLL, ActionsInTestEnum.SET_DEVICE].includes(type)
	) {
		return;
	}

	switch (type) {
		case ActionsInTestEnum.WAIT_FOR_NAVIGATION: {
			const isLastEventWaitForNavigation = lastRecordedAction && lastRecordedAction!.type === ActionsInTestEnum.WAIT_FOR_NAVIGATION;
			if (isLastEventWaitForNavigation) {
				store.dispatch(updateLastRecordedAction({ ...action, type: ActionsInTestEnum.WAIT_FOR_NAVIGATION }));
			} else {
				store.dispatch(recordAction({ ...action, type: ActionsInTestEnum.WAIT_FOR_NAVIGATION }));
			}
			break;
		}
		case ActionsInTestEnum.NAVIGATE_URL: {
			const hasInitialNavigationActionRegistered =
				recordedActions.findIndex((recordedAction) => recordedAction.type === ActionsInTestEnum.NAVIGATE_URL) !== -1;

			const isLastEventWaitForNavigation = lastRecordedAction && lastRecordedAction!.type === ActionsInTestEnum.WAIT_FOR_NAVIGATION;

			if (!hasInitialNavigationActionRegistered) {
				store.dispatch(recordAction(action));
			} else {
				if (isLastEventWaitForNavigation) {
					store.dispatch(updateLastRecordedAction({ ...action, type: ActionsInTestEnum.WAIT_FOR_NAVIGATION }));
				} else {
					store.dispatch(recordAction({ ...action, type: ActionsInTestEnum.WAIT_FOR_NAVIGATION }));
				}
			}
			store.dispatch(updateIsRecorderScriptBooted(false));
			break;
		}
		case ActionsInTestEnum.ADD_INPUT: {
			const isLastEventAddInput = lastRecordedAction.type === ActionsInTestEnum.ADD_INPUT;
			if (lastRecordedAction.type === ActionsInTestEnum.CLICK && (await areTwoNodesSame(action, lastRecordedAction))) {
				// Delete click if last action is click on same element
				store.dispatch(deleteRecordedAction(recordedActions.length - 1));
			}

			if (
				isLastEventAddInput &&
				(await areTwoNodesSame(action, lastRecordedAction)) &&
				action.payload.meta.value.value === lastRecordedAction.payload.meta.value.value
			)
				return;

			if (
				isLastEventAddInput &&
				(await areTwoNodesSame(action, lastRecordedAction)) &&
				[InputNodeTypeEnum.INPUT, InputNodeTypeEnum.TEXTAREA, InputNodeTypeEnum.CONTENT_EDITABLE, InputNodeTypeEnum.SELECT].includes(
					action.payload.meta.value.type,
				)
			) {
				// Store add inputs in an array values
				store.dispatch(updateLastRecordedAction(action));
			} else {
				console.log("Value here", lastRecordedAction.type === ActionsInTestEnum.CLICK, action, lastRecordedAction);

				if (
					lastRecordedAction.type === ActionsInTestEnum.CLICK &&
					action.payload.meta.value.labelsUniqId &&
					(await checkIfLabelIdIncludesCurrent(lastRecordedAction, action))
				) {
					if (
						action.payload.meta.value.value !== lastRecordedAction.payload.meta.value.inputInfo.value &&
						action.payload.meta.value.type !== InputNodeTypeEnum.INPUT
					)
						return;
				}
				store.dispatch(recordAction(action));
				return false;
			}
			break;
		}
		case ActionsInTestEnum.PAGE_SCROLL:
		case ActionsInTestEnum.ELEMENT_SCROLL: {
			const isScrollingToSameLastElement =
				[ActionsInTestEnum.PAGE_SCROLL, ActionsInTestEnum.ELEMENT_SCROLL].includes(lastRecordedAction.type) &&
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
		case ActionsInTestEnum.HOVER: {
			const url = new URL(window.location.href);
			if (url.searchParams.get("device") === "Pixel33XL") {
				// Disable hover in mobile devices
				return;
			}

			const isTheLastRecordedActionSame =
				lastRecordedAction.type === ActionsInTestEnum.HOVER &&
				(lastRecordedAction.payload.selectors as iSelectorInfo[])[0].value === (action.payload.selectors as iSelectorInfo[])[0].value;

			if (!isTheLastRecordedActionSame) {
				store.dispatch(recordAction(action));
			}
			break;
		}
		case ActionsInTestEnum.CLICK: {
			const isTheLastRecordedActionOnSameElementFocus =
				lastRecordedAction.type === ActionsInTestEnum.ELEMENT_FOCUS &&
				(lastRecordedAction.payload.selectors as iSelectorInfo[])[0].value === (action.payload.selectors as iSelectorInfo[])[0].value;
			store.dispatch(recordAction(action));
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
		case MESSAGE_TYPES.DELETE_LAST_ACTION: {
			const recordedActions = getActions(store.getState());
			store.dispatch(deleteRecordedAction(recordedActions.length - 1));
			break;
		}
		case MESSAGE_TYPES.SAVE_RECORDED_TEST: {
			saveTest();
			break;
		} 
		case MESSAGE_TYPES.CLEAR_RECORDED_ACTIONS: {
			const store = getStore();
			store.dispatch(resetRecordedActions());
			break;
		}
		case MESSAGE_TYPES.SET_IS_VERIFYING_STATE: {
			const store = getStore();
			store.dispatch(setIsTestReplaying(event.data.meta.value));
			break;
		}
		case MESSAGE_TYPES.SET_IS_REPLAYING: {
			const store = getStore();
			store.dispatch(setIsTestReplaying(event.data.meta.value));
			break;
		}
		case MESSAGE_TYPES.RECORD_REPLAY_ACTION: {
			const store = getStore();

			store.dispatch(recordAction(event.data.meta));
			break;
		}
		case MESSAGE_TYPES.RECORD_ACTION_META: {
			const metaArr = event.data.meta.finalActions as Array<iAction>;
			for (let i = 0; i < metaArr.length; i++) {
				handleRecordAction(metaArr[i]);
			}
			break;
		}
		case MESSAGE_TYPES.UPDATE_LAST_RECORDED_ACTION_STATUS: {
			const {status} = event.data.meta;
			const store = getStore();
			store.dispatch(updateLastRecordedActionStatus(status));
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
			const isAutoRecorderOn = getAutoRecorderState(store.getState());
			const meta = event.data.meta as iElementModeMessageMeta;
			const hoverDependentSelectors = (event.data as any).hoverDependentNodesSelectors as Array<{ selectors: Array<iSelectorInfo> }>;
			store.dispatch(updateActionsRecordingState(ACTIONS_RECORDING_STATE.ELEMENT, meta, isAutoRecorderOn ? hoverDependentSelectors : []));
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

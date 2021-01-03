import { iAction } from "./interfaces/actionsReducer";
import { getStore } from "./redux/store";
import { recordAction } from "./redux/actions/actions";
import {
	updateActionsRecordingState,
	updateInspectModeState,
	updateIsRecorderScriptBooted,
} from "./redux/actions/recorder";
import { ACTIONS_RECORDING_STATE } from "./interfaces/actionsRecordingState";
import { iSelectorInfo } from "./utils/selector";
import { iAttribute } from "./interfaces/recorderReducer";
import { RefObject } from "react";
import {
	getActionsRecordingState,
	isRecorderScriptBooted,
} from "./redux/selectors/recorder";
import { AdvancedURL } from "./utils/url";
import userAgents from "../../crusher-shared/constants/userAgents";
import { FRAME_MESSAGE_TYPES } from "./scripts/inject/responseMessageListener";

export enum MESSAGE_TYPES {
	RECORD_ACTION = "RECORD_ACTION",
	UPDATE_INSPECTOR_MODE_STATE = "UPDATE_INSPECTOR_MODE_STATE",
	TURN_ON_ELEMENT_MODE = "TURN_ON_ELEMENT_MODE",
	TURN_OFF_ELEMENT_MODE = "TURN_OFF_ELEMENT_MODE",
	RECORDER_BOOTED = "RECORDER_BOOTED",
	REQUEST_RECORDING_STATUS = "REQUEST_RECORDING_STATUS",
	REQUEST_USER_AGENT = "REQUEST_USER_AGENT",
	SEO_META_INFORMATION = "SEO_META_INFORMATION",
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

function handleRecordAction(action: iAction) {
	const store = getStore();

	const { type } = action;
	switch (type) {
		default:
			store.dispatch(recordAction(action));
			break;
	}

	return true;
}

function sendTestRecorderStatusToFrame(
	deviceIframeRef: RefObject<HTMLIFrameElement>,
) {
	const store = getStore();

	if (!deviceIframeRef.current)
		throw new Error("Iframe not available yet from ref context");

	const cn = deviceIframeRef.current.contentWindow;

	const inUsingInspectorMode =
		getActionsRecordingState(store.getState()).type ===
		ACTIONS_RECORDING_STATE.ELEMENT;

	const isRecording = isRecorderScriptBooted(store.getState());

	cn?.postMessage(
		{
			type: FRAME_MESSAGE_TYPES.RECORDING_STATUS_REQUEST_RESPONSE,
			meta: {
				value: inUsingInspectorMode
					? RECORDING_STATUS.INSPECTOR_MODE_ON
					: isRecording
					? RECORDING_STATUS.INSPECTOR_MODE_OFF
					: RECORDING_STATUS.RECORDER_SCRIPT_NOT_BOOTED,
			},
		},
		"*",
	);
}

function sendUserAgentToFrame(deviceIframeRef: RefObject<HTMLIFrameElement>) {
	if (!deviceIframeRef.current)
		throw new Error("Iframe not available yet from ref context");

	const cn = deviceIframeRef.current.contentWindow;
	// Extension url contains selected device
	const device = AdvancedURL.getDeviceFromCrusherExtensionUrl(
		window?.location.href,
	);
	const userAgent = userAgents.find(
		(agent) => agent.name === (device.userAgent || userAgents[6].value),
	);
	cn?.postMessage(
		{
			type: FRAME_MESSAGE_TYPES.USER_AGENT_REQUEST_RESPONSE,
			meta: { value: userAgent },
		},
		"*",
	);
}

export function recorderMessageListener(
	deviceIframeRef: RefObject<HTMLIFrameElement>,
	event: MessageEvent<iMessage>,
) {
	const store = getStore();

	const { type } = event.data;

	switch (type) {
		case MESSAGE_TYPES.RECORD_ACTION: {
			const meta = event.data.meta as iAction;
			handleRecordAction(meta);
			break;
		}
		case MESSAGE_TYPES.UPDATE_INSPECTOR_MODE_STATE: {
			const meta = event.data.meta as iUpdateInspectorMessageMeta;
			store.dispatch(updateInspectModeState(meta.value));
			break;
		}
		case MESSAGE_TYPES.TURN_ON_ELEMENT_MODE: {
			const meta = event.data.meta as iElementModeMessageMeta;
			store.dispatch(
				updateActionsRecordingState(ACTIONS_RECORDING_STATE.ELEMENT, meta),
			);
			break;
		}
		case MESSAGE_TYPES.RECORDER_BOOTED: {
			store.dispatch(updateIsRecorderScriptBooted(true));
			break;
		}
		case MESSAGE_TYPES.REQUEST_RECORDING_STATUS: {
			sendTestRecorderStatusToFrame(deviceIframeRef);
			break;
		}
		case MESSAGE_TYPES.REQUEST_USER_AGENT: {
			sendUserAgentToFrame(deviceIframeRef);
			break;
		}
		case MESSAGE_TYPES.SEO_META_INFORMATION: {
			break;
		}
		default:
			console.debug("Unknown Message type");
			break;
	}

	return true;
}
//
// export function recorderMessageListener(event: MessageEvent<iMessage>) {
// 	const { type, eventType, value, selectors } = event.data;
// 	console.log(type, eventType, value);
// 	const steps = getSteps();
// 	if (eventType) {
// 		const lastStep = steps[steps.length - 1];
// 		if (!lastStep) {
// 			setSteps([...getSteps(), { event_type: eventType, value, selectors }]);
// 			setLastStepTime(Date.now());
// 		} else {
// 			const navigateEventExist = steps.find(
// 				(step) => step.event_type === ACTIONS_IN_TEST.NAVIGATE_URL,
// 			);
//
// 			if (!(navigateEventExist && eventType === ACTIONS_IN_TEST.NAVIGATE_URL)) {
// 				if (
// 					eventType === ACTIONS_IN_TEST.ADD_INPUT &&
// 					(lastStep.event_type !== ACTIONS_IN_TEST.ADD_INPUT ||
// 						(lastStep.event_type === ACTIONS_IN_TEST.ADD_INPUT &&
// 							lastStep.selectors[0].value !== selectors[0].value))
// 				) {
// 					setSteps([
// 						...getSteps(),
// 						{ event_type: eventType, value: [value], selectors },
// 					]);
// 					setLastStepTime(Date.now());
// 				} else if (
// 					lastStep.event_type === ACTIONS_IN_TEST.ADD_INPUT &&
// 					eventType === ACTIONS_IN_TEST.ADD_INPUT &&
// 					lastStep.selectors[0].value === selectors[0].value
// 				) {
// 					steps[steps.length - 1].value = [...steps[steps.length - 1].value, value];
// 					setSteps(steps);
// 					setLastStepTime(Date.now());
// 				} else if (
// 					lastStep.event_type === ACTIONS_IN_TEST.SCROLL &&
// 					eventType === ACTIONS_IN_TEST.SCROLL &&
// 					lastStep.selectors[0] === selectors[0]
// 				) {
// 					steps[steps.length - 1] = {
// 						event_type: eventType,
// 						value: [...lastStep.value, value],
// 						selectors,
// 					};
// 					setSteps([...steps]);
// 					setLastStepTime(Date.now());
// 				} else {
// 					if (eventType === ACTIONS_IN_TEST.SCROLL) {
// 						setSteps([
// 							...getSteps(),
// 							{ event_type: eventType, value: [value], selectors },
// 						]);
// 						setLastStepTime(Date.now());
// 					} else {
// 						setSteps([...getSteps(), { event_type: eventType, value, selectors }]);
// 						setLastStepTime(Date.now());
// 					}
// 				}
// 			}
// 		}
// 	} else if (type) {
// 		const cn = iframeRef.current.contentWindow;
//
// 		const iframeURL = getQueryStringParams("url", window.location.href) as string;
// 		const crusherAgent = getQueryStringParams("__crusherAgent__", iframeURL);
// 		const userAgent = userAgents.find(
// 			(agent) => agent.name === (crusherAgent || userAgents[6].value),
// 		);
//
// 		switch (type) {
// 			case SETTINGS_ACTIONS.INSPECT_MODE_ON:
// 				setIsInspectModeOn(true);
// 				break;
// 			case SETTINGS_ACTIONS.INSPECT_MODE_OFF:
// 				setIsInspectModeOn(false);
// 				break;
// 			case SETTINGS_ACTIONS.SHOW_ELEMENT_FORM_IN_SIDEBAR:
// 				setIsShowingElementForm(true);
// 				setCurrentElementSelectors(selectors);
// 				setCurrentElementAttributes(event.data.attributes);
// 				break;
// 			case SETTINGS_ACTIONS.START_RECORDING:
// 				setIsRecording(true);
// 				break;
// 			// case ACTION_TYPES.TOOGLE_INSPECTOR:
// 			//     setIsUsingElementInspector(!isUsingElementInspector);
// 			//     break;
// 			case META_ACTIONS.FETCH_RECORDING_STATUS:
// 				cn.postMessage(
// 					{
// 						type: META_ACTIONS.FETCH_RECORDING_STATUS_RESPONSE,
// 						value: isUsingElementInspector
// 							? START_INSPECTING_RECORDING_MODE
// 							: isRecording
// 							? START_NON_INSPECTING_RECORDING_MODE
// 							: NOT_RECORDING,
// 						isFromParent: true,
// 					},
// 					"*",
// 				);
// 				break;
// 			case META_ACTIONS.FETCH_USER_AGENT:
// 				cn.postMessage(
// 					{ type: META_ACTIONS.FETCH_USER_AGENT_RESPONSE, value: userAgent },
// 					"*",
// 				);
// 				break;
// 			case META_ACTIONS.FETCH_SEO_META_RESPONSE:
// 				setSeoMeta({ title: value.title, metaTags: value.metaTags });
// 				break;
// 		}
// 	}
// 	return true;
// }

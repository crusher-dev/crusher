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

interface iMessage {
	type: MESSAGE_TYPES;
	meta: any;
}

interface iUpdateInspectorMessageMeta {
	value: boolean;
}

interface iElementModeMessageMeta {
	selectors: Array<iSelectorInfo>;
	attributes: Array<iAttribute>;
	innerHTML: string;
}

const store = getStore();

function handleRecordAction(action: iAction) {
	const { type } = action;
	switch (type) {
		default:
			store.dispatch(recordAction(action));
			break;
	}

	return true;
}

export function recorderMessageListener(event: MessageEvent<iMessage>) {
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
			break;
		}
		case MESSAGE_TYPES.REQUEST_USER_AGENT: {
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

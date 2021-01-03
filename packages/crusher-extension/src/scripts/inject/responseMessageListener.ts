import {
	iMessage,
	MESSAGE_TYPES,
	RECORDING_STATUS,
} from "../../messageListener";
import EventRecording from "./ui/eventRecording";
import { getAllSeoMetaInfo } from "../../utils/dom";
import { TOP_LEVEL_ACTION } from "../../interfaces/topLevelAction";
import { ELEMENT_LEVEL_ACTION } from "../../interfaces/elementLevelAction";
import { ACTIONS_RECORDING_STATE } from "../../interfaces/actionsRecordingState";

export enum FRAME_MESSAGE_TYPES {
	USER_AGENT_REQUEST_RESPONSE = "USER_AGENT_REQUEST_RESPONSE",
	RECORDING_STATUS_REQUEST_RESPONSE = "RECORDING_STATUS_REQUEST_RESPONSE",
	UPDATE_INSPECT_MODE_STATE = "UPDATE_INSPECT_MODE_STATE",
	PERFORM_ACTION = "PERFORM_ACTION",
	REQUEST_SEO_META = "REQUEST_SEO_META",
	GO_BACK_TO_PREVIOUS_URL = "GO_BACK_TO_PREVIOUS_URL",
	GO_FORWARD_TO_NEXT_URL = "GO_FORWARD_TO_NEXT_URL",
	REFRESH_PAGE = "REFRESH_PAGE",
}

export interface iInspectModeUpdateMeta {
	isInspectModeOn: boolean;
}

interface iRecordStatusResponseMeta {
	value: RECORDING_STATUS;
}

export interface iPerformActionMeta {
	type: TOP_LEVEL_ACTION | ELEMENT_LEVEL_ACTION;
	recordingState: ACTIONS_RECORDING_STATE;
}

function sendSeoMetaToParentFrame() {
	const metaTagsValuesMap = getAllSeoMetaInfo();

	window.top.postMessage(
		{
			type: MESSAGE_TYPES.SEO_META_INFORMATION,
			meta: {
				title: document.title,
				metaTags: metaTagsValuesMap,
			},
		},
		"*",
	);
}

export function responseMessageListener(
	eventRecording: EventRecording,
	event: MessageEvent<iMessage>,
) {
	const { type } = event.data;
	switch (type) {
		case FRAME_MESSAGE_TYPES.PERFORM_ACTION: {
			const meta = event.data.meta as iPerformActionMeta;
			this.eventRecording.performSimulatedAction(meta);
			break;
		}
		case FRAME_MESSAGE_TYPES.UPDATE_INSPECT_MODE_STATE: {
			const meta = event.data.meta as iInspectModeUpdateMeta;
			if (meta.isInspectModeOn) {
				eventRecording.toggleInspector();
			} else {
				eventRecording.enableJavascriptEvents();
				eventRecording.turnInspectModeOff();
				eventRecording.unpin();
			}
			break;
		}
		case FRAME_MESSAGE_TYPES.RECORDING_STATUS_REQUEST_RESPONSE: {
			const meta = event.data.meta as iRecordStatusResponseMeta;
			if (
				meta.value === RECORDING_STATUS.INSPECTOR_MODE_OFF ||
				meta.value === RECORDING_STATUS.RECORDER_SCRIPT_NOT_BOOTED
			) {
				eventRecording.boot(true);
			} else if (meta.value === RECORDING_STATUS.INSPECTOR_MODE_ON) {
				eventRecording.boot();
				eventRecording.toggleInspector();
			}
			break;
		}
		case FRAME_MESSAGE_TYPES.REQUEST_SEO_META:
			sendSeoMetaToParentFrame();
			break;
		case FRAME_MESSAGE_TYPES.GO_BACK_TO_PREVIOUS_URL:
			window.history.back();
			break;
		case FRAME_MESSAGE_TYPES.REFRESH_PAGE:
			window.location.reload();
			break;
		case FRAME_MESSAGE_TYPES.GO_FORWARD_TO_NEXT_URL:
			window.history.forward();
			break;
		default:
			console.debug("Unknown Message type, here");
			break;
	}

	return true;
}

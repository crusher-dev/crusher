import EventRecording from "./ui/eventRecording";
import { MESSAGE_TYPES } from "../../messageListener";
import { getFrameDepth } from "../../utils/helpers";
import { responseMessageListener } from "./responseMessageListener";

function requestRecordingStatusFromExtension() {
	window.top.postMessage(
		{
			type: MESSAGE_TYPES.REQUEST_RECORDING_STATUS,
		},
		"*",
	);
}
const frameDepth = getFrameDepth(window.self);

function boot() {
	if (frameDepth !== 1) {
		return;
	}
	const recordingOverlay = new EventRecording({});

	requestRecordingStatusFromExtension();

	window.addEventListener("message", responseMessageListener.bind(window, recordingOverlay), false);
}

boot();

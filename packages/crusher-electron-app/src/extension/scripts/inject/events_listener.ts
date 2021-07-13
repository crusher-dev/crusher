import EventRecording from "./ui/eventRecording";
import { MESSAGE_TYPES } from "../../messageListener";
import { responseMessageListener } from "./responseMessageListener";

function requestRecordingStatusFromExtension() {
	(window as any).electron.host.postMessage({
		type: MESSAGE_TYPES.REQUEST_RECORDING_STATUS,
	});
}

function boot() {
	const recordingOverlay = new EventRecording({});

	requestRecordingStatusFromExtension();

	(window as any).electron.webview.addEventListener("message", responseMessageListener.bind(window, recordingOverlay), false);
}

boot();

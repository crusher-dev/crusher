import EventRecording from "./ui/eventRecording";
import { MESSAGE_TYPES } from "../../messageListener";
import { responseMessageListener } from "./responseMessageListener";
import { setupContentScriptForElectronReload } from "../../utils/electronReload";
import { getFrameDepth } from "../../utils/helpers";
const frameDepth = getFrameDepth(window.self);

function requestRecordingStatusFromExtension() {
	if((window as any).electron) {
	   (window as any).electron.host.postMessage({
			type: MESSAGE_TYPES.REQUEST_RECORDING_STATUS,
		});
	} else {
		console.log("Current url is", window.location.href);
	}
}

function boot() {
	console.log("Global", global.sendMessageToWebView);

	(window as any).eventRecorderExecuted = true;

	window.addEventListener("load", () => {
		if (process.env.NODE_ENV === "development") {
			setupContentScriptForElectronReload();
		}

		const recordingOverlay = new EventRecording({});
		requestRecordingStatusFromExtension();

		recordingOverlay.boot();
	});
}

if (frameDepth === 0 && !window.location.href.startsWith("chrome-extension://")) {
	boot();
}
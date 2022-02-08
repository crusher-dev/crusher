import EventRecording from "./ui/eventRecording";
import { getFrameDepth } from "./utils/helper";
const frameDepth = getFrameDepth(window.self);

function boot() {
	console.log("Global", global.sendMessageToWebView);

	(window as any).eventRecorderExecuted = true;

	window.addEventListener("DOMContentLoaded", () => {
		console.log("Recording loaded");
		const recordingOverlay = new EventRecording({});

		recordingOverlay.boot();
	});
}
console.log("Script called", window.location.href);

if (!window.location.href.startsWith("file://")) {
	boot();
}
import EventRecording from "./ui/eventRecording";

function boot() {
	(window as any).eventRecorderExecuted = true;

	window.addEventListener("DOMContentLoaded", () => {
		console.log("Recording loaded");
		const recordingOverlay = new EventRecording({});

		recordingOverlay.boot();
	});
}

// @TODO: This also gets added to top recorder screen because
// of playwright addInitScript. Look into this
if (!window.location.href.startsWith("file://") && !(window as any).eventRecorderExecuted) {
	boot();
}

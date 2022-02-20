import EventRecording from "./ui/eventRecording";

function boot() {
	(window as any).eventRecorderExecuted = true;

	window.addEventListener("DOMContentLoaded", () => {
		console.log("Recording loaded");
		const recordingOverlay = new EventRecording({});

		recordingOverlay.boot();
	});
}

if (!window.location.href.startsWith("file://") && !(window as any).eventRecorderExecuted) {
	boot();
}

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

	window.addEventListener(
		"message",
		responseMessageListener.bind(window, recordingOverlay),
		false,
	);
}

if (frameDepth === 1 && window.name === "crusher_iframe") {
	fetch(chrome.runtime.getURL("iframe_inject.html") /* , options */)
		.then((response) => response.text())
		.then((html) => {
			const htmlWrapper = document.createElement("div");
			htmlWrapper.innerHTML = html;
			document.body.appendChild(htmlWrapper);

			const linkRel = document.createElement("link");
			linkRel.setAttribute("rel", "stylesheet");
			linkRel.setAttribute("href", chrome.runtime.getURL("styles/overlay.css"));
			document.head.appendChild(linkRel);

			boot();
		})
		.catch((err) => {
			console.debug("Something went wrong while appending crusher content script");
			console.error(err);
		});
}

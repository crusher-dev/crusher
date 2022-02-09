/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import EventRecording from "./ui/eventRecording";
import { getFrameDepth } from "./utils/helper";
const frameDepth = getFrameDepth(window.self);

function boot() {
	console.log("Global", global.sendMessageToWebView);

	(window as any).eventRecorderExecuted = true;

	function clickListener(event) {
		console.log("Shadow clicked", event.target);
		const customEvent = new CustomEvent("shadowMouseDown", { detail: { event, element: event.target, clientX: event.clientX, clientY: event.clientY } });
		window.dispatchEvent(customEvent);
	}

	const elementsListenerMap = {};
	(Element.prototype as any)._attachShadow = Element.prototype.attachShadow;
	Element.prototype.attachShadow = function (...argumentsa) {
		const customEvent = new CustomEvent("attachShadow", { detail: { arguments: argumentsa, element: this } });
		const out = this._attachShadow(...argumentsa);
		document.body.dispatchEvent(customEvent);
		//@ts-ignore
		const element = this;
		// console.log("Element attached to shadow", element);
		if (elementsListenerMap[element]) {
			element.shadowRoot.removeEventListener("mousedown", clickListener.bind(null), true);
		}
		element.shadowRoot.addEventListener("mousedown", clickListener.bind(null), true);
		elementsListenerMap[element] = true;
		return out;
	};

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

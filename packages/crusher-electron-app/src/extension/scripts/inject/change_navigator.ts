import { iMessage, MESSAGE_TYPES } from "../../messageListener";
import { FRAME_MESSAGE_TYPES } from "./responseMessageListener";
import { iUserAgent } from "@shared/constants/userAgents";
import { getFrameDepth } from "../../utils/helpers";
import { setupContentScriptForElectronReload } from "../../utils/electronReload";

(window as any).isCrusherRecorder = true;

const frameDepth = getFrameDepth(window.self);

if (frameDepth === 1 && window.name === "crusher_iframe") {
	setupContentScriptForElectronReload();
}

const actualCode = `(${(userAgent: string, appVersion: string, platformVersion: string) => {
	const { navigator } = window;
	let modifiedNavigator;
	if ("userAgent" in Navigator.prototype) {
		// Chrome 43+ moved all properties from navigator to the prototype,
		// so we have to modify the prototype instead of navigator.
		modifiedNavigator = Navigator.prototype;
	} else {
		// Chrome 42- defined the property on navigator.
		modifiedNavigator = Object.create(navigator);
		Object.defineProperty(window, "navigator", {
			value: modifiedNavigator,
			configurable: false,
			enumerable: false,
			writable: false,
		});
	}
	Object.defineProperties(modifiedNavigator, {
		userAgent: {
			value: userAgent,
			configurable: false,
			enumerable: true,
			writable: false,
		},
		platform: {
			value: platformVersion,
			configurable: false,
			enumerable: true,
			writable: false,
		},
	});
}})`;

window.top.postMessage(
	{
		type: MESSAGE_TYPES.REQUEST_USER_AGENT,
		frameId: null,
		value: true,
	},
	"*",
);

window.addEventListener("message", (message: MessageEvent<iMessage>) => {
	const { type, meta } = message.data;

	if (type === FRAME_MESSAGE_TYPES.USER_AGENT_REQUEST_RESPONSE) {
		const userAgent: iUserAgent = meta.value;
		const s = document.createElement("script");
		s.textContent = `${actualCode}('${userAgent.value}', '${userAgent.appVersion}', '${userAgent.platform}');`;
		document.documentElement.appendChild(s);
		s.remove();
	}
});

if(document.documentElement){
	const s = document.createElement("div");
	s.setAttribute("id", "test");
	document.documentElement.appendChild(s);
}
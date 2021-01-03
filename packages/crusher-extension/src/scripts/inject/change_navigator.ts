import { NAVIGATOR_ACTIONS } from "../../constants/actionTypes";
import { MESSAGE_TYPES } from "../../messageListener";

const actualCode = `(${(
	userAgent: string,
	appVersion: string,
	platformVersion: string,
) => {
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

window.addEventListener("message", (message) => {
	const { type, value: userAgent } = message.data;

	if (!!type === false) {
		return;
	}
	if (type === NAVIGATOR_ACTIONS.FETCH_USER_AGENT_RESPONSE) {
		const s = document.createElement("script");
		s.textContent = `${actualCode}('${userAgent.value}', '${userAgent.appVersion}', '${userAgent.platform}');`;
		document.documentElement.appendChild(s);
		s.remove();
	}
});

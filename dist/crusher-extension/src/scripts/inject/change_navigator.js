"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("~/crusher-extension/src/constants/actionTypes");
const frameStorage_1 = __importDefault(require("../../utils/frameStorage"));
const actualCode = `(${(userAgent, appVersion, platformVersion) => {
    const { navigator } = window;
    let modifiedNavigator;
    if ("userAgent" in Navigator.prototype) {
        // Chrome 43+ moved all properties from navigator to the prototype,
        // so we have to modify the prototype instead of navigator.
        modifiedNavigator = Navigator.prototype;
    }
    else {
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
window.top.postMessage({
    type: actionTypes_1.NAVIGATOR_ACTIONS.FETCH_USER_AGENT,
    // @ts-ignore
    frameId: frameStorage_1.default.get(),
    value: true,
}, "*");
window.addEventListener("message", (message) => {
    const { type, value: userAgent } = message.data;
    if (!!type === false) {
        return;
    }
    if (type === actionTypes_1.NAVIGATOR_ACTIONS.FETCH_USER_AGENT_RESPONSE) {
        const s = document.createElement("script");
        s.textContent = `${actualCode}('${userAgent.value}', '${userAgent.appVersion}', '${userAgent.platform}');`;
        document.documentElement.appendChild(s);
        s.remove();
    }
});
//# sourceMappingURL=change_navigator.js.map
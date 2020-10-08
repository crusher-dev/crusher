import { ACTION_TYPES } from "../../constants/actionTypes";
import LocalFrameStorage from "../../utils/frameStorage";

const actualCode = `(${(
  userAgent: string,
  appVersion: string,
  platformVersion: string
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
    type: ACTION_TYPES.GET_USER_AGENT,
    // @ts-ignore
    frameId: LocalFrameStorage.get(),
    value: true,
  },
  "*"
);

window.addEventListener("message", (message) => {
  const { type, value: userAgent } = message.data;

  if (!!type === false) {
    return;
  }
  if (type === ACTION_TYPES.SET_USER_AGENT) {
    const s = document.createElement("script");
    s.textContent = `${actualCode}('${userAgent.value}', '${userAgent.appVersion}', '${userAgent.platform}');`;
    document.documentElement.appendChild(s);
    s.remove();
  }
});

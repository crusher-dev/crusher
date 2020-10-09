"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("~/crusher-extension/src/constants/actionTypes");
const domEventsToRecord_1 = require("~/crusher-extension/src/constants/domEventsToRecord");
const eventRecording_1 = __importDefault(require("./ui/eventRecording"));
const frameStorage_1 = __importDefault(require("../../utils/frameStorage"));
const constants_1 = require("../../constants");
const app_1 = require("../../ui/testRecorder/app");
if (top !== self) {
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
    }).catch((err) => {
        console.debug("Something went wrong while appending crusher content script");
        console.error(err);
    });
    const recordingOverlay = new eventRecording_1.default({});
    window.top.postMessage({
        type: actionTypes_1.META_ACTIONS.FETCH_RECORDING_STATUS,
        // @ts-ignore
        frameId: frameStorage_1.default.get(),
    }, "*");
    window.addEventListener("message", (message) => {
        const { type, value, formType } = message.data;
        if (!!type === false) {
            return;
        }
        if (formType === app_1.ACTION_FORM_TYPE.PAGE_ACTIONS) {
            switch (type) {
                case actionTypes_1.SETTINGS_ACTIONS.INSPECT_MODE_ON:
                    recordingOverlay.showEventsFormWizard();
                    break;
                case actionTypes_1.SETTINGS_ACTIONS.INSPECT_MODE_OFF:
                    recordingOverlay.removeEventsFormWizard();
                    break;
                case actionTypes_1.SETTINGS_ACTIONS.TAKE_ELEMENT_SCREENSHOT:
                    recordingOverlay.takePageScreenShot();
                    break;
                case actionTypes_1.SETTINGS_ACTIONS.START_CAPTURING_CONSOLE:
                    recordingOverlay.saveConsoleLogsAtThisMoment();
                    break;
                case actionTypes_1.META_ACTIONS.FETCH_SEO_META:
                    const metaDesc = document.querySelector('meta[name="description"]');
                    window.top.postMessage({
                        type: actionTypes_1.META_ACTIONS.FETCH_SEO_META_RESPONSE,
                        // @ts-ignore
                        frameId: frameStorage_1.default.get(),
                        value: {
                            title: document.title,
                            description: metaDesc ? metaDesc.content : null
                        },
                    }, "*");
                    break;
            }
        }
        else if (formType === app_1.ACTION_FORM_TYPE.ELEMENT_ACTIONS) {
            recordingOverlay.hideEventsBoxIfShown();
            if (type !== domEventsToRecord_1.ACTIONS_IN_TEST.ASSERT_ELEMENT) {
                recordingOverlay.handleSelectedActionFromEventsList({ action: type });
            }
        }
        else {
            switch (type) {
                case actionTypes_1.SETTINGS_ACTIONS.GO_BACK_TO_PREVIOUS_URL:
                    window.history.back();
                    break;
                case actionTypes_1.SETTINGS_ACTIONS.GO_FORWARD_TO_NEXT_URL:
                    window.history.forward();
                    break;
                case actionTypes_1.SETTINGS_ACTIONS.REFRESH_PAGE:
                    window.location.reload();
                    break;
                case actionTypes_1.META_ACTIONS.FETCH_RECORDING_STATUS_RESPONSE:
                    const { isFromParent } = message.data;
                    if (!isFromParent) {
                        break;
                    }
                    if (value === constants_1.START_NON_INSPECTING_RECORDING_MODE ||
                        value === constants_1.NOT_RECORDING) {
                        recordingOverlay.boot(true);
                    }
                    else if (value === constants_1.START_INSPECTING_RECORDING_MODE) {
                        recordingOverlay.boot();
                        recordingOverlay.showEventsFormWizard();
                    }
                    break;
            }
        }
    }, false);
    document.addEventListener("keydown", (event) => {
        if (event.repeat) {
            return;
        }
        if (event.keyCode === 68 && event.shiftKey) {
            recordingOverlay.highlightInspectedElement();
        }
    }, true);
    document.addEventListener("keyup", () => {
        recordingOverlay.stopInspectorIfMoving();
    }, true);
}
//# sourceMappingURL=events_listener.js.map
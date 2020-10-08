"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventRecording_1 = __importDefault(require("./ui/eventRecording"));
const actionTypes_1 = require("../../constants/actionTypes");
const frameStorage_1 = __importDefault(require("../../utils/frameStorage"));
const constants_1 = require("../../constants");
const app_1 = require("../../ui/testRecorder/app");
const domEventsToRecord_1 = require("../../constants/domEventsToRecord");
if (top !== self) {
    fetch(chrome.runtime.getURL("iframe_inject.html") /* , options */)
        .then((response) => response.text())
        .then((html) => {
        try {
            const htmlWrapper = document.createElement("div");
            htmlWrapper.innerHTML = html;
            document.body.appendChild(htmlWrapper);
            const linkRel = document.createElement("link");
            linkRel.setAttribute("rel", "stylesheet");
            linkRel.setAttribute("href", chrome.runtime.getURL("styles/overlay.css"));
            document.head.appendChild(linkRel);
        }
        catch (ex) {
            console.log("Exception");
            console.error("This is the exception", ex);
        }
    });
    const recordingOverlay = new eventRecording_1.default({});
    window.top.postMessage({
        type: actionTypes_1.ACTION_TYPES.GET_RECORDING_STATUS,
        // @ts-ignore
        frameId: frameStorage_1.default.get(),
        value: true,
    }, "*");
    window.addEventListener("message", (message) => {
        const { type, value, formType } = message.data;
        if (!!type === false) {
            return;
        }
        if (formType === app_1.ACTION_FORM_TYPE.PAGE_ACTIONS) {
            switch (type) {
                case actionTypes_1.ACTION_TYPES.INSPECT:
                    if (value)
                        recordingOverlay.showEventsFormWizard();
                    else
                        recordingOverlay.removeEventsFormWizard();
                    break;
                case actionTypes_1.ACTION_TYPES.SCREENSHOT:
                    recordingOverlay.takePageScreenShot();
                    break;
                case actionTypes_1.ACTION_TYPES.CAPTURE_CONSOLE:
                    recordingOverlay.saveConsoleLogsAtThisMoment();
                    break;
                case actionTypes_1.ACTION_TYPES.GET_SEO_META:
                    const metaDesc = document.querySelector('meta[name="description"]');
                    window.top.postMessage({
                        type: actionTypes_1.ACTION_TYPES.SET_SEO_META,
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
            if (type === domEventsToRecord_1.ASSERT_TEXT) {
            }
            else {
                recordingOverlay.handleSelectedActionFromEventsList({ action: type });
            }
        }
        else {
            switch (type) {
                case actionTypes_1.ACTION_TYPES.GO_BACK:
                    window.history.back();
                    break;
                case actionTypes_1.ACTION_TYPES.GO_FORWARD:
                    window.history.forward();
                    break;
                case actionTypes_1.ACTION_TYPES.REFRESH_PAGE:
                    window.location.reload();
                    break;
                case actionTypes_1.ACTION_TYPES.TOOGLE_INSPECTOR:
                    break;
                case actionTypes_1.ACTION_TYPES.RECORDING_STATUS_RESPONSE:
                    const { isFromParent } = message.data;
                    if (!isFromParent) {
                        break;
                    }
                    if (value === constants_1.IS_RECORDING_WITHOUT_INSPECTOR ||
                        value === constants_1.NOT_RECORDING) {
                        recordingOverlay.boot(true);
                    }
                    else if (value === constants_1.IS_RECORDING_USING_INSPECTOR) {
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
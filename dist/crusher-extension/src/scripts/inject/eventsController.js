"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const frameStorage_1 = __importDefault(require("../../utils/frameStorage"));
const selector_1 = require("../../utils/selector");
class EventsController {
    constructor(recordingOverlay) {
        this.recordingOverlay = recordingOverlay;
    }
    simulateClickOnElement(element) {
        try {
            const event = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: false,
            });
            // Add this property so that global click listener
            // recognizes this is ans simulated event.
            event.simulatedEvent = true;
            element.dispatchEvent(event);
        }
        catch (err) {
            console.error(element, err);
        }
    }
    simulateHoverOnElement(el) {
        try {
            const event = new Event("MS");
            event.initEvent("mouseover", true, true);
            el.dispatchEvent(event);
        }
        catch (err) {
            console.error(el, err);
        }
    }
    saveCapturedEventInBackground(event_type, capturedTarget, value = "", callback) {
        const selectors = capturedTarget ? selector_1.getSelectors(capturedTarget) : null;
        window.top.postMessage({
            eventType: event_type,
            // @ts-ignore
            frameId: frameStorage_1.default.get(),
            value,
            selectors,
        }, "*");
    }
}
exports.default = EventsController;
//# sourceMappingURL=eventsController.js.map
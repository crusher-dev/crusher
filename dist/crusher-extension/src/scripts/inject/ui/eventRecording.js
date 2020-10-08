"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const domEventsToRecord_1 = require("../../../constants/domEventsToRecord");
const dom_1 = require("../../../utils/dom");
const eventsController_1 = __importDefault(require("../eventsController"));
const frameStorage_1 = __importDefault(require("../../../utils/frameStorage"));
const actionTypes_1 = require("../../../constants/actionTypes");
const selector_1 = require("../../../utils/selector");
const { createPopper } = require("@popperjs/core");
class EventRecording {
    constructor(options = {}) {
        this.defaultState = {
            targetElement: null,
            sessionGoingOn: false,
            showingEventsBox: false,
            pinned: false,
        };
        this.awake = false;
        this.isInspectorMoving = false;
        this.state = Object.assign({}, this.defaultState);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleAddIconClick = this.handleAddIconClick.bind(this);
        this.handleEventsGridClick = this.handleEventsGridClick.bind(this);
        this.takePageScreenShot = this.takePageScreenShot.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.eventsController = new eventsController_1.default(this);
        this.toggleEventsBox = this.toggleEventsBox.bind(this);
    }
    getState() {
        return this.state;
    }
    toggleEventsBox() {
        if (!this.isInspectorMoving) {
            this.highlightInspectedElement();
        }
        else {
            this.hideEventsBoxIfShown();
        }
    }
    highlightInspectedElement() {
        this.isInspectorMoving = true;
        // this._addActionElement.style.display = 'block';
        const { targetElement } = this.state;
        if (targetElement) {
            this.highlightNode(targetElement);
        }
    }
    hideEventsBoxIfShown() {
        this.removeInspector();
        this.isInspectorMoving = false;
        this._addActionElement.style.display = "none";
    }
    stopInspectorIfMoving() {
        if (this.isInspectorMoving) {
            this.isInspectorMoving = false;
        }
    }
    showAddIcon(target) {
        if (this._addActionElement) {
            this.destroyAddTether();
            this._addActionTether = createPopper(target, this._addActionElement, {
                placement: "right-start",
                modifiers: [
                    {
                        name: "flip",
                        enabled: true,
                    },
                    {
                        name: "offset",
                        options: {
                            offset: [-1, 0],
                        },
                    },
                    {
                        name: "arrow",
                        options: {
                            element: this._arrowOnAddIcon,
                        },
                    },
                ],
            });
            this._addActionElement.style.display = "block";
        }
    }
    showEventsList() {
        console.debug("Showing events list", this._overlayAddEventsContainer);
        this._overlayAddEventsContainer.style.display = "block";
        this.state.pinned = true;
        // Increase the height of actions containers to give more space for not falling out of selection.
        this._addActionElement.style.height = `${this._overlayAddEventsContainer.getBoundingClientRect().height}px`;
        this.destoryEventsListTether();
        this._eventsListTether = createPopper(this._addActionModal, this._overlayAddEventsContainer, {
            placement: "right-start",
            modifiers: [
                {
                    name: "flip",
                    enabled: true,
                },
            ],
        });
    }
    destroyAddTether() {
        if (this._addActionTether) {
            this._addActionTether.destroy();
            this._addActionTether = null;
        }
    }
    destoryEventsListTether() {
        if (this._eventsListTether) {
            this._eventsListTether.destroy();
            this._eventsListTether = null;
        }
    }
    initNodes() {
        this._modalHeading = document.querySelector(".overlay_heading_container .overlay_heading");
        this._addActionElement = document.querySelector("#overlay_add_action");
        this._addActionIcon = document.querySelector("#overlay_add");
        this._addActionModal = document.querySelector("#overlay_add_icon");
        this._closeActionIcon = document.querySelector("#overlay_add_events_container .overlay_close_icon");
        this._overlayAddEventsContainer = document.querySelector("#overlay_add_events_container");
        this._overlayEventsGrid = document.querySelector("#events_grid");
        this._arrowOnAddIcon = document.querySelector("#popper_arrow");
        this._modalContentContainer = document.querySelector(".overlay_modal_content");
    }
    updateEventTarget(target) {
        this.state = Object.assign(Object.assign({}, this.state), { targetElement: target });
        if (this.isInspectorMoving) {
            this.highlightNode(target);
        }
        this.showAddIcon(target);
    }
    highlightNode(target) {
        target.style.outlineStyle = "solid";
        target.style.outlineColor = "#EC2E6A";
        target.style.outlineWidth = "1px";
    }
    removeHighLightFromNode(target) {
        // @FIXME: What if the target had set outlineColor and outlineStyleBefore.
        if (target) {
            target.style.outlineStyle = "none";
            target.style.outlineColor = "none";
            target.style.outlineWidth = "0px";
        }
    }
    handleSelectedActionFromEventsList(event) {
        // If its coming from testRecorder popup use event.action
        const action = event.action
            ? event.action
            : event.target.getAttribute("data-action");
        switch (action) {
            case domEventsToRecord_1.CLICK:
                dom_1.removeAllTargetBlankFromLinks();
                this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.CLICK, this.state.targetElement);
                this.eventsController.simulateClickOnElement(this.state.targetElement);
                break;
            case domEventsToRecord_1.HOVER:
                this.eventsController.simulateHoverOnElement(this.state.targetElement);
                this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.HOVER, this.state.targetElement);
                break;
            case domEventsToRecord_1.BLACKOUT:
                this.state.targetElement.style.visibility = "hidden";
                this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.BLACKOUT, this.state.targetElement);
                break;
            case domEventsToRecord_1.SCREENSHOT:
                this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.SCREENSHOT, this.state.targetElement);
                break;
            case domEventsToRecord_1.SCROLL_TO_VIEW:
                this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.SCROLL_TO_VIEW, this.state.targetElement);
                break;
            default:
                break;
        }
        this.toggleEventsBox();
    }
    handleMouseOver(event) {
        if (this._addActionElement) {
            if (this._addActionElement.contains(event.target) ||
                // @ts-ignore
                event.target.hasAttribute("data-recorder") ||
                this.state.pinned) {
                return event.preventDefault();
            }
        }
        const { targetElement } = this.state;
        if (targetElement !== event.target && this.isInspectorMoving) {
            // Remove Highlight from last element hovered
            this.removeHighLightFromNode(targetElement);
            this.updateEventTarget(event.target);
        }
    }
    handleAddIconClick() {
        // @TODO: Post message to parent frame to show the form.
        this.stopInspectorIfMoving();
        this._addActionElement.style.display = "none";
        window.top.postMessage({
            type: actionTypes_1.ACTION_TYPES.SHOW_ELEMENT_FORM,
            // @ts-ignore
            frameId: frameStorage_1.default.get(),
            value: selector_1.getSelectors(this.state.targetElement),
        }, "*");
    }
    handleEventsGridClick(event) {
        this.handleSelectedActionFromEventsList(event);
    }
    // eslint-disable-next-line consistent-return
    handleDocumentClick(event) {
        const isRecorder = event.target.getAttribute("data-recorder");
        if (!isRecorder) {
            this.state.pinned = false;
            const { target } = event;
            if (target.tagName.toLowerCase() === "a") {
                const href = target.getAttribute("href");
                this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.CLICK, event.target);
                if (href) {
                    window.location = href;
                }
                return event.preventDefault();
            }
            if (!event.simulatedEvent) {
                this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.CLICK, event.target);
            }
        }
    }
    handleInputChange(event) {
        const targetElement = event.target;
        this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.INPUT, event.target, targetElement.value);
    }
    registerNodeListeners() {
        alert("GODD");
        document.body.addEventListener("mousemove", this.handleMouseOver, true);
        document.body.addEventListener("input", this.handleInputChange, true);
        document.addEventListener("click", this.handleDocumentClick, true);
    }
    registerNodeListenerForForm() {
        this._addActionElement.addEventListener("click", this.handleAddIconClick);
        this._overlayEventsGrid.addEventListener("click", this.handleEventsGridClick, true);
        this._closeActionIcon.addEventListener("click", this.toggleEventsBox, true);
    }
    takePageScreenShot() {
        this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.PAGE_SCREENSHOT, document.body, document.title);
    }
    saveConsoleLogsAtThisMoment() {
        this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.CAPTURE_CONSOLE, document.body, document.title);
    }
    removeNodeListeners() {
        document.body.removeEventListener("mousemove", this.handleMouseOver, true);
        this._addActionIcon.removeEventListener("click", this.handleAddIconClick);
        this._overlayEventsGrid.removeEventListener("click", this.handleEventsGridClick, true);
    }
    boot(isFirstTime = false) {
        this.awake = true;
        if (isFirstTime) {
            const currentURL = new URL(window.location.href);
            currentURL.searchParams.delete("__crusherAgent__");
            this.eventsController.saveCapturedEventInBackground(domEventsToRecord_1.NAVIGATE_URL, document.body, currentURL.toString());
        }
        window.top.postMessage({
            type: actionTypes_1.ACTION_TYPES.STARTED_RECORDING_EVENTS,
            // @ts-ignore
            frameId: frameStorage_1.default.get(),
            value: true,
        }, "*");
        this.registerNodeListeners();
    }
    showEventsFormWizard() {
        this.initNodes();
        this.registerNodeListenerForForm();
        if (this.isInspectorMoving) {
            this.toggleEventsBox();
            this.isInspectorMoving = false;
        }
        else {
            this.isInspectorMoving = true;
            window.top.postMessage({
                type: actionTypes_1.ACTION_TYPES.TOOGLE_INSPECTOR,
                // @ts-ignore
                frameId: frameStorage_1.default.get(),
            }, "*");
        }
        console.info("Info Overlay booted up");
    }
    removeNodes() {
        if (this._addActionElement) {
            this._addActionElement.remove();
        }
    }
    removeInspector() {
        const { targetElement } = this.state;
        if (targetElement) {
            this.removeHighLightFromNode(targetElement);
        }
    }
    removeEventsFormWizard() {
        const { targetElement } = this.state;
        console.debug("Shutting down Recording Overlay");
        this.removeNodeListeners();
        if (targetElement) {
            this.removeHighLightFromNode(targetElement);
        }
        this.removeNodes();
        this.state = Object.assign(Object.assign({}, this.state), { sessionGoingOn: false });
    }
}
exports.default = EventRecording;
//# sourceMappingURL=eventRecording.js.map
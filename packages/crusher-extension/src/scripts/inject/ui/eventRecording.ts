import { getAllAttributes } from "../../../utils/helpers";
import { ACTIONS_IN_TEST } from "../../../../../crusher-shared/constants/recordedActions";
import { DOM } from "../../../utils/dom";
import EventsController from "../eventsController";
import { getSelectors } from "../../../utils/selector";
import {
	iElementModeMessageMeta,
	MESSAGE_TYPES,
} from "../../../messageListener";
import { iPerformActionMeta } from "../responseMessageListener";
import { ACTIONS_RECORDING_STATE } from "../../../interfaces/actionsRecordingState";
import { TOP_LEVEL_ACTION } from "../../../interfaces/topLevelAction";
import { ELEMENT_LEVEL_ACTION } from "../../../interfaces/elementLevelAction";

export default class EventRecording {
	defaultState: any = {
		targetElement: null,
		sessionGoingOn: false,
		showingEventsBox: false,
		pinned: false,
	};

	private state: any;

	private eventsController: EventsController;

	private _overlayCover: any;

	private isInspectorMoving = false;

	private hoveringState: any = {
		element: null,
		time: Date.now(),
	};

	private scrollTimer: any = null;
	private lastScrollFireTime = 0;

	private resetUserEventsToDefaultCallback: any = undefined;

	constructor(options = {} as any) {
		this.state = {
			...this.defaultState,
		};

		this.onLeftClick = this.onLeftClick.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.handleScroll = this.handleScroll.bind(this);

		this.turnOnElementModeInParentFrame = this.turnOnElementModeInParentFrame.bind(
			this,
		);
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.eventsController = new EventsController(this);
		this.pollInterval = this.pollInterval.bind(this);
	}

	getState() {
		return this.state;
	}

	hideEventsBoxIfShown() {
		this.removeInspector();
		this.isInspectorMoving = false;
	}

	initNodes() {
		console.debug("Registering all nodes");
		this._overlayCover = document.querySelector("#overlay_cover");
	}

	updateEventTarget(target: HTMLElement, event: any) {
		this.state = {
			...this.state,
			targetElement: target,
		};

		if (this.isInspectorMoving) {
			this.highlightNode(target, event);
		}
	}

	elementsAtLocation(x: number, y: number) {
		const stack = [];
		let el;
		do {
			el = document.elementFromPoint(x, y);
			if (!el) {
				break;
			}
			stack.push(el);
			if (stack.length > 5) {
				break;
			}
			el?.classList.add("pointerEventsNone");
		} while (el?.tagName !== "HTML");

		// clean up
		for (let i = 0; i < stack.length; i += 1)
			stack[i]?.classList.remove("pointerEventsNone");

		return stack;
	}

	getOffset(el: any) {
		let _x = 0;
		let _y = 0;
		while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
			_x += el.offsetLeft - el.scrollLeft;
			_y += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
		}
		return { top: _y, left: _x };
	}

	highlightNode(_target: any, event: any = null) {
		this._overlayCover.style.position = "absolute";
		let target = _target;
		if (event) {
			const elements = this.elementsAtLocation(event.clientX, event.clientY);
			if (elements && elements.length > 1 && elements[0].id === "overlay_cover") {
				target = elements[1];
			}
		}
		this._overlayCover.style.top =
			window.scrollY + target.getBoundingClientRect().y + "px";
		this._overlayCover.style.left =
			window.scrollX + target.getBoundingClientRect().x + "px";
		this._overlayCover.style.width = target.getBoundingClientRect().width + "px";
		this._overlayCover.style.height =
			target.getBoundingClientRect().height + "px";
		this._overlayCover.style["z-index"] = 299999999;
		this._overlayCover.style.outlineStyle = "solid";
		this._overlayCover.style.outlineColor = "#EC2E6A";
		this._overlayCover.style.outlineWidth = "1px";
	}

	removeHighLightFromNode(target: HTMLElement) {
		// @FIXME: What if the target had set outlineColor and outlineStyleBefore.
		if (target) {
			target.style.outlineStyle = "none";
			target.style.outlineColor = "none";
			target.style.outlineWidth = "0px";
		}
		console.error("This is target", target);
	}

	performSimulatedAction(meta: iPerformActionMeta) {
		const { type, recordingState } = meta;
		if (recordingState === ACTIONS_RECORDING_STATE.PAGE) {
			switch (type) {
				case TOP_LEVEL_ACTION.TOGGLE_INSPECT_MODE:
					this.toggleInspectorInParentFrame();
					break;
			}
		} else if (recordingState === ACTIONS_RECORDING_STATE.ELEMENT) {
			switch (type) {
				case ELEMENT_LEVEL_ACTION.CLICK:
					this.performSimulatedClick();
					break;
				case ELEMENT_LEVEL_ACTION.HOVER:
					this.performSimulatedHover();
					break;
				case ELEMENT_LEVEL_ACTION.BLACKOUT:
					this.state.targetElement.style.visibility = "hidden";
					break;
			}

			// Now user has selected an element action
			this.enableJavascriptEvents();
		}
	}

	enableJavascriptEvents() {
		if (this.resetUserEventsToDefaultCallback) {
			this.resetUserEventsToDefaultCallback();
			this.resetUserEventsToDefaultCallback = null;
		}
	}
	performSimulatedClick() {
		DOM.removeAllTargetBlankFromLinks();
		this.eventsController.simulateClickOnElement(this.state.targetElement);
	}

	performSimulatedHover() {
		this.eventsController.simulateHoverOnElement(this.state.targetElement);
	}

	onLeftClick(event: Event) {
		event.preventDefault();
		this.turnInspectModeOnInParentFrame();

		const eventExceptions = {
			mousemove: this.handleMouseMove.bind(this),
			mouseover: this.handleMouseMove.bind(this),
			mouseout: this.handleMouseOut.bind(this),
			input: this.handleKeyPress.bind(this),
			click: this.handleDocumentClick.bind(this),
			contextmenu: this.onLeftClick.bind(this),
		};

		if (!this.resetUserEventsToDefaultCallback) {
			this.resetUserEventsToDefaultCallback = DOM.disableAllUserEvents(
				eventExceptions,
			);
		}

		this.removeHighLightFromNode(event.target as HTMLElement);
		this.updateEventTarget(event.target as HTMLElement, event);
	}

	handleMouseMove(event: MouseEvent) {
		const { targetElement } = this.state;

		if (!this.state.pinned) {
			// Remove Highlight from last element hovered
			this.removeHighLightFromNode(targetElement);
			this.updateEventTarget(event.target as HTMLElement, event);
		}
	}

	handleMouseOver(event: MouseEvent) {
		if (
			this.hoveringState !== event.target &&
			(event.target as any).id !== "overlay_cover"
		) {
			this.hoveringState = {
				element: event.target,
				time: Date.now(),
			};
		}
	}

	handleMouseOut(event: MouseEvent) {
		if (this.hoveringState.element === event.target) {
			this.hoveringState = {
				element: null,
				time: Date.now(),
			};
		}
	}

	handleScroll(event: any) {
		const minScrollTime = 100;
		const now = new Date().getTime();
		// console.log("Scrolled, ", event.target);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const _this = this;
		function processScroll() {
			const target = event.target;

			const isDocumentScrolled = event.target === document;
			if (isDocumentScrolled) {
				return _this.eventsController.saveCapturedEventInBackground(
					ACTIONS_IN_TEST.SCROLL,
					window,
					window.scrollY,
				);
			}

			const isRecorderCover = target.getAttribute("data-recorder-cover");
			if (!isRecorderCover && !event.simulatedEvent) {
				_this.eventsController.saveCapturedEventInBackground(
					ACTIONS_IN_TEST.SCROLL,
					event.target,
					event.target.scrollTop,
				);
			} else {
				return event.preventDefault();
			}
		}

		if (!this.scrollTimer) {
			if (now - this.lastScrollFireTime > 3 * minScrollTime) {
				processScroll(); // fire immediately on first scroll
				this.lastScrollFireTime = now;
			}
			this.scrollTimer = setTimeout(function () {
				_this.scrollTimer = null;
				_this.lastScrollFireTime = new Date().getTime();
				processScroll();
			}, minScrollTime);
		}
	}

	pollInterval() {
		if (this.hoveringState.element && this.hoveringState.time) {
			const diffInMilliSeconds = Date.now() - this.hoveringState.time;
			const activeFocusElement: any = document.activeElement;
			console.log("Here it is");
			if (diffInMilliSeconds > 1000 && activeFocusElement.tagName !== "INPUT") {
				// Only record hover if not in input mode focus.
				this.eventsController.saveCapturedEventInBackground(
					ACTIONS_IN_TEST.HOVER,
					this.hoveringState.element,
				);
				this.hoveringState = {
					element: null,
					time: Date.now(),
				};
			}
		}
	}

	turnOnElementModeInParentFrame() {
		window.top.postMessage(
			{
				type: MESSAGE_TYPES.TURN_ON_ELEMENT_MODE,
				meta: {
					selectors: getSelectors(this.state.targetElement),
					attributes: getAllAttributes(this.state.targetElement),
					innerHTML: this.state.targetElement.innerHTML,
				} as iElementModeMessageMeta,
			},
			"*",
		);
	}

	unpin() {
		console.log("Unpinning");
		this.state.pinned = false;
		if (
			this._overlayCover &&
			(!this._overlayCover.style.left || this._overlayCover.style.left !== "0px")
		) {
			this._overlayCover.classList.remove("pointerEventsNone");
			this._overlayCover.style.left = "0px";
			this._overlayCover.style.top = "0px";
			this._overlayCover.style.width = "0px";
			this._overlayCover.style.height = "0px";
		}
	}

	// eslint-disable-next-line consistent-return
	handleDocumentClick(event: any) {
		let target = event.target;
		const isRecorderCover = target.getAttribute("data-recorder-cover");
		if (isRecorderCover) {
			console.log("Printing elements at this location");
			const elements = this.elementsAtLocation(event.clientX, event.clientY);
			target = elements[0];
			if (elements && elements.length > 1 && elements[0].id === "overlay_cover") {
				target = elements[1];
			}
			this.state.pinned = true;
			this.state.targetElement = target ? target : event.target;
			this._overlayCover.classList.add("pointerEventsNone");
			this.turnOnElementModeInParentFrame();
			return;
		}

		const closestLink: HTMLAnchorElement = target.closest("a");
		if (closestLink && closestLink.tagName.toLowerCase() === "a") {
			const href = closestLink.getAttribute("href");
			this.eventsController.saveCapturedEventInBackground(
				ACTIONS_IN_TEST.CLICK,
				closestLink,
			);
			console.log("Going to this link", href);
			if (href) {
				window.location.href = href;
			}
			return event.preventDefault();
		}
		if (!event.simulatedEvent) {
			this.eventsController.saveCapturedEventInBackground(
				ACTIONS_IN_TEST.CLICK,
				event.target,
			);
		}
	}

	handleKeyPress(event: any) {
		const targetElement = event.target;

		this.eventsController.saveCapturedEventInBackground(
			ACTIONS_IN_TEST.ADD_INPUT,
			targetElement,
			event.keyCode,
		);
	}

	registerNodeListeners() {
		document.body.addEventListener("mousemove", this.handleMouseMove, true);
		document.body.addEventListener("mouseover", this.handleMouseOver, true);
		document.body.addEventListener("mouseout", this.handleMouseOut, true);
		document.addEventListener("contextmenu", this.onLeftClick, true);

		window.addEventListener("scroll", this.handleScroll, true);

		(window as any).open = (function (open) {
			return function (url: string) {
				console.log("Opening a new tab", url);
				window.location.href = url;
			};
		})(window.open);

		document.body.addEventListener("keypress", this.handleKeyPress, true);
		document.addEventListener("click", this.handleDocumentClick, true);
		setInterval(this.pollInterval, 300);
	}

	removeNodeListeners() {
		document.body.removeEventListener("mousemove", this.handleMouseMove, true);
	}

	boot(isFirstTime = false) {
		this.initNodes();

		if (isFirstTime) {
			const currentURL = new URL(window.location.href);
			currentURL.searchParams.delete("__crusherAgent__");
			this.eventsController.saveCapturedEventInBackground(
				ACTIONS_IN_TEST.NAVIGATE_URL,
				document.body,
				currentURL.toString(),
			);
		}
		window.top.postMessage(
			{
				type: MESSAGE_TYPES.RECORDER_BOOTED,
				frameId: null,
			},
			"*",
		);
		this.registerNodeListeners();
	}

	turnInspectModeOnInParentFrame() {
		console.debug("Turning inspect element mode on");
		this.isInspectorMoving = true;
		window.top.postMessage(
			{
				type: MESSAGE_TYPES.UPDATE_INSPECTOR_MODE_STATE,
				meta: {
					value: true,
				},
				frameId: null,
			},
			"*",
		);
	}

	turnInspectModeOffInParentFrame() {
		this.isInspectorMoving = false;
		window.top.postMessage(
			{
				type: MESSAGE_TYPES.UPDATE_INSPECTOR_MODE_STATE,
				meta: {
					value: false,
				},
				frameId: null,
			},
			"*",
		);
	}

	toggleInspectorInParentFrame() {
		if (this.isInspectorMoving) {
			this.turnInspectModeOffInParentFrame();
		} else {
			this.turnInspectModeOnInParentFrame();
		}
		console.info("Info Overlay booted up");
	}

	removeInspector() {
		this.unpin();
	}

	shutdown() {
		console.debug("Shutting down Recording Overlay");
		this.removeNodeListeners();

		this.state = {
			...this.state,
			sessionGoingOn: false,
		};
	}
}

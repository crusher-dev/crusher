import { getAllAttributes } from "../../../utils/helpers";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { DOM } from "../../../utils/dom";
import EventsController from "../eventsController";
import { getSelectors } from "../../../utils/selector";
import { iElementModeMessageMeta, MESSAGE_TYPES } from "../../../messageListener";
import { iPerformActionMeta } from "../responseMessageListener";
import { ACTIONS_RECORDING_STATE } from "../../../interfaces/actionsRecordingState";
import { TOP_LEVEL_ACTION } from "../../../interfaces/topLevelAction";
import { ELEMENT_LEVEL_ACTION } from "../../../interfaces/elementLevelAction";
import { RelevantHoverDetection } from "./relevantHoverDetection";
import html2canvas from "html2canvas";
import { ChangeEvent } from "react";

const KEYS_TO_TRACK_FOR_INPUT = new Set(["Enter", "Escape", "Tab"]);

const KEYS_TO_TRACK_FOR_TEXTAREA = new Set([
	// Enter types a line break, shouldn't be a press.
	"Escape",
	"Tab",
]);

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

	private pointerEventsMap: Array<{ data: PointerEvent }> = [];
	private recordedHoverArr: Array<any> = [];

	private hoveringState: any = {
		element: null,
		time: Date.now(),
	};

	private scrollTimer: any = null;
	private lastScrollFireTime = 0;

	private resetUserEventsToDefaultCallback: any = undefined;
	private releventHoverDetectionManager: RelevantHoverDetection;

	constructor(options = {} as any) {
		this.state = {
			...this.defaultState,
		};

		this.onRightClick = this.onRightClick.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseOver = this.handleMouseOver.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleBeforeNavigation = this.handleBeforeNavigation.bind(this);
		this.handlePointerEnter = this.handlePointerEnter.bind(this);
		this.handleCrusherHoverTrace = this.handleCrusherHoverTrace.bind(this);
		this.handleElementSelected = this.handleElementSelected.bind(this);
		this.trackAndSaveRelevantHover = this.trackAndSaveRelevantHover.bind(this);
		this.getHoverDependentNodes = this.getHoverDependentNodes.bind(this);
		this.clickThroughElectron = this.clickThroughElectron.bind(this);
		this.hoverThroughElectron = this.hoverThroughElectron.bind(this);
		this.handleElementInput = this.handleElementInput.bind(this);
		this.handleElementChange = this.handleElementChange.bind(this);

		this.releventHoverDetectionManager = new RelevantHoverDetection();

		this.turnOnElementModeInParentFrame = this.turnOnElementModeInParentFrame.bind(this);
		this.handleWindowClick = this.handleWindowClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.eventsController = new EventsController(this);
		this.pollInterval = this.pollInterval.bind(this);
	}

	getState() {
		return this.state;
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
		for (let i = 0; i < stack.length; i += 1) stack[i]?.classList.remove("pointerEventsNone");

		return stack;
	}

	executeCustomElementScript(script: string) {
		return new Function(
			"element",
			`return new Promise(async function (resolve, reject) {
				    try{
				        const l = ${script};
				        resolve(l(element));
				    } catch(err){
				      reject(err);
				    }
				});`,
		)(this.state.targetElement);
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
		this._overlayCover.style.top = window.scrollY + target.getBoundingClientRect().y + "px";
		this._overlayCover.style.left = window.scrollX + target.getBoundingClientRect().x + "px";
		this._overlayCover.style.width = target.getBoundingClientRect().width + "px";
		this._overlayCover.style.height = target.getBoundingClientRect().height + "px";
		this._overlayCover.style["z-index"] = 299999999;
		this._overlayCover.style.outlineStyle = "solid";
		this._overlayCover.style.outlineColor = "rgb(226, 223, 108)";
		this._overlayCover.style.outlineWidth = "1px";
	}

	removeHighLightFromNode(target: HTMLElement) {
		// @FIXME: What if the target had set outlineColor and outlineStyleBefore.
		if (target) {
			target.style.outlineStyle = "none";
			target.style.outlineColor = "none";
			target.style.outlineWidth = "0px";
		}
	}

	clickThroughElectron(node) {
		console.log("CRUSHER_CLICK_ELEMENT", node);
		return true;
	}

	hoverThroughElectron(node) {
		console.log("CRUSHER_HOVER_ELEMENT", node);
		return true;
	}

	async performSimulatedAction(meta: iPerformActionMeta) {
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
					this.clickThroughElectron(this.state.targetElement);
					break;
				case ELEMENT_LEVEL_ACTION.HOVER:
					this.hoverThroughElectron(this.state.targetElement);
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

	onRightClick(event: Event) {
		event.preventDefault();
		if (this.isInspectorMoving) {
			this.removeHighLightFromNode(event.target as HTMLElement);
			this.enableJavascriptEvents();
			this.turnInspectModeOffInParentFrame();
			this.unpin();
		} else {
			this.turnInspectModeOnInParentFrame();
			const eventExceptions = {
				mousemove: this.handleMouseMove.bind(this),
				mouseover: this.handleMouseMove.bind(this),
				pointerenter: this.handlePointerEnter.bind(this),
				mouseout: this.handleMouseOut.bind(this),
				click: this.handleWindowClick.bind(this),
				contextmenu: this.onRightClick.bind(this),
			};

			if (!this.resetUserEventsToDefaultCallback) {
				this.resetUserEventsToDefaultCallback = DOM.disableAllUserEvents(eventExceptions);
			}
		}
	}

	handleMouseMove(event: MouseEvent) {
		const { targetElement } = this.state;

		if (!this.state.pinned) {
			// Remove Highlight from last element hovered
			this.removeHighLightFromNode(targetElement);
			// this.updateEventTarget(event.target as HTMLElement, event);
		}
	}

	handleMouseOver(event: MouseEvent) {
		if (this.hoveringState !== event.target && (event.target as any).id !== "overlay_cover") {
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
		if (!event.isFromUser) return;
		const minScrollTime = 100;
		const now = new Date().getTime();
		// console.log("Scrolled, ", event.target);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const _this = this;
		function processScroll() {
			const target = event.target;

			const isDocumentScrolled = event.target === document;
			if (isDocumentScrolled) {
				return _this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.PAGE_SCROLL, null, window.scrollY);
			}

			const isRecorderCover = target.getAttribute("data-recorder-cover");
			if (!isRecorderCover && !event.simulatedEvent) {
				// @TODO: Need a proper way to detect real and fake scroll events
				_this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ELEMENT_SCROLL, event.target, event.target.scrollTop);
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
				_this.lastScrollFireTime = window.performance.now();
				processScroll();
			}, minScrollTime);
		}
	}

	pollInterval() {
		if (this.hoveringState.element && this.hoveringState.time) {
			const diffInMilliSeconds = Date.now() - this.hoveringState.time;
			const activeFocusElement: any = document.activeElement;
			if (diffInMilliSeconds > 1000 && activeFocusElement.tagName !== "INPUT") {
				// Only record hover if not in input mode focus.
				// this.eventsController.saveCapturedEventInBackground(
				// 	ActionsInTestEnum.HOVER,
				// 	this.hoveringState.element,
				// );
				this.hoveringState = {
					element: null,
					time: Date.now(),
				};
			}
		}
	}

	async getHoverDependentNodes(element, baseLineTimeStamp: number | null = null): Promise<Array<any>> {
		const needsOtherActions = await this.releventHoverDetectionManager.isCoDependentNode(element, baseLineTimeStamp);
		if (needsOtherActions) {
			const hoverNodesRecord = this.releventHoverDetectionManager.getParentDOMMutations(element, baseLineTimeStamp);
			console.log("Hover nodes records", hoverNodesRecord);
			const hoverNodes = hoverNodesRecord.map((record) => record.eventNode);
			if (hoverNodes.length && hoverNodes[hoverNodes.length - 1] === element) {
				hoverNodes.pop();
			}
			return hoverNodes.filter((node: HTMLElement) => {
				const boundingBox = node.getBoundingClientRect();
				const centerX = boundingBox.x + boundingBox.width / 2;
				const centerY = boundingBox.y + boundingBox.height / 2;
				const nodeAtCenter = document.elementFromPoint(centerX, centerY);

				return nodeAtCenter === node || node.contains(nodeAtCenter);
			});
		}

		return [];
	}

	async trackAndSaveRelevantHover(element, baseLineTimeStamp: number | null = null) {
		const hoverNodes = await this.getHoverDependentNodes(element, baseLineTimeStamp);
		for (let i = 0; i < hoverNodes.length; i++) {
			console.log("Hover nodes area", hoverNodes[i]);
			await this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.HOVER, hoverNodes[i], "", null, true);
		}
	}

	async turnOnElementModeInParentFrame(element = this.state.targetElement) {
		// const capturedElementScreenshot = await html2canvas(element).then((canvas: any) => canvas.toDataURL());
		const hoverDependentNodesSelectors = await this.eventsController.getSelectorsOfNodes(await this.getHoverDependentNodes(element));
		const capturedElementScreenshot = null;
		(window as any).electron.host.postMessage({
			type: MESSAGE_TYPES.TURN_ON_ELEMENT_MODE,
			hoverDependentNodesSelectors: hoverDependentNodesSelectors,
			meta: {
				selectors: getSelectors(element),
				attributes: getAllAttributes(element),
				innerHTML: element.innerHTML,
				screenshot: capturedElementScreenshot,
			} as iElementModeMessageMeta,
		});
	}

	unpin() {
		console.log("Unpinning");
		this.state.pinned = false;
		if (this._overlayCover) {
			this._overlayCover.classList.remove("pointerEventsNone");
			this._overlayCover.style.left = "0px";
			this._overlayCover.style.top = "0px";
			this._overlayCover.style.width = "0px";
			this._overlayCover.style.height = "0px";
		}
	}

	// eslint-disable-next-line consistent-return
	async handleWindowClick(event: any) {
		let target = event.target;
		const isRecorderCover = target.getAttribute("data-recorder-cover");
		if (isRecorderCover) {
			// Disable event propagation to stop other event listener to act like outSideClick Detector.
			event.stopPropagation();
			event.preventDefault();

			console.log("Printing elements at this location");
			const elements = this.elementsAtLocation(event.clientX, event.clientY);
			target = elements[0];
			if (elements && elements.length > 1 && elements[0].id === "overlay_cover") {
				target = elements[1];
			}
			this.state.pinned = true;
			// this.state.targetElement = target ? target : event.target;
			this._overlayCover.classList.add("pointerEventsNone");
			this.turnOnElementModeInParentFrame();
			return;
		}

		const closestLink: HTMLAnchorElement = target.tagName === "a" ? target : target.closest("a");

		// If clientX and clientY is 0 it may mean that the event is not triggered
		// by user. Found during creating tests for ielts search
		console.log("Event now", event.isTrusted, !event.simulatedEvent, event.clientX, event.clientY);
		if (!event.simulatedEvent && event.isTrusted && (event.clientX || event.clientY)) {
			await this.trackAndSaveRelevantHover(target, event.timeStamp);

			await this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.CLICK, event.target);
		}

		if (closestLink && closestLink.tagName.toLowerCase() === "a") {
			const href = closestLink.getAttribute("href");
			if (href) {
				window.location.href = href;
				return event.preventDefault();
			}
		}
	}

	handleKeyDown(event: KeyboardEvent) {
		const key = event.key;
		if (KEYS_TO_TRACK_FOR_INPUT.has(key)) {
			this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.PRESS, event.target, key);
		}
	}

	handleFocus(event: FocusEvent) {
		// const target = event.target as HTMLElement;
		// if ((target as any) != window && ["textarea", "input"].includes(target.tagName.toLowerCase())) {
		// 	this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ELEMENT_FOCUS, target, true);
		// }
	}

	handlePointerEnter(event: PointerEvent) {
		const timeNow = window.performance.now();

		if (this.scrollTimer) {
			return;
		}
		const lastEvent = this.recordedHoverArr.length > 0 ? this.recordedHoverArr[this.recordedHoverArr.length - 1] : null;
		if (lastEvent) {
			const diff = timeNow - lastEvent.timeStamp;
			if (diff > 200) {
				this.pointerEventsMap.push({ data: event });
				this.recordedHoverArr.push(event);
			}
			return;
		}
		this.pointerEventsMap.push({ data: event });
		this.recordedHoverArr.push(event);
	}

	handleCrusherHoverTrace(
		event: CustomEvent & {
			detail: { type: string; key: string; eventNode: Node; targetNode: Node };
		},
	) {
		this.releventHoverDetectionManager.registerDOMMutation({
			...event.detail,
		});
	}

	handleElementSelected(event: CustomEvent & { detail: { element: HTMLElement } }) {
		this.state.targetElement = event.detail.element;
		this.turnOnElementModeInParentFrame(event.detail.element);
	}

	handleElementInput(event: InputEvent) {
		const value = (event.target as HTMLInputElement).value;
		this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ADD_INPUT, event.target, value);
	}

	handleElementChange(event: InputEvent) {
		const value = (event.target as HTMLInputElement).value;
		// this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ADD_INPUT, event.target, value);
	}

	registerNodeListeners() {
		window.addEventListener("mousemove", this.handleMouseMove, true);
		window.addEventListener("mouseover", this.handleMouseOver, true);
		window.addEventListener("mouseout", this.handleMouseOut, true);
		window.addEventListener("contextmenu", this.onRightClick, true);
		window.addEventListener("focus", this.handleFocus, true);
		window.addEventListener("crusherHoverTrace", this.handleCrusherHoverTrace);
		window.addEventListener("elementSelected", this.handleElementSelected);
		window.addEventListener("input", this.handleElementInput);
		window.addEventListener("change", this.handleElementChange);

		document.body.addEventListener("pointerenter", this.handlePointerEnter, true);

		window.addEventListener("scroll", this.handleScroll, true);

		window.onbeforeunload = this.handleBeforeNavigation;
		window.addEventListener("keydown", this.handleKeyDown, true);

		window.addEventListener("click", this.handleWindowClick, true);

		window.history.pushState = new Proxy(window.history.pushState, {
			apply: async (target, thisArg, argArray) => {
				this.releventHoverDetectionManager.reset();
				const out = target.apply(thisArg, argArray);
				this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.WAIT_FOR_NAVIGATION, null);
				return out;
			},
		});

		window.history.replaceState = new Proxy(window.history.pushState, {
			apply: async (target, thisArg, argArray) => {
				this.releventHoverDetectionManager.reset();
				const out = target.apply(thisArg, argArray);
				this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.WAIT_FOR_NAVIGATION, null);
				return out;
			},
		});
		setInterval(this.pollInterval, 300);
	}

	removeNodeListeners() {
		window.removeEventListener("mousemove", this.handleMouseMove, true);
	}

	boot(isFirstTime = false) {
		console.log("Starting...");
		this.initNodes();

		if (isFirstTime) {
			const currentURL = new URL(window.location.href);
			currentURL.searchParams.delete("__crusherAgent__");
			this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.NAVIGATE_URL, document.body, currentURL.toString());
		}
		(window as any).electron.host.postMessage({
			type: MESSAGE_TYPES.RECORDER_BOOTED,
			frameId: null,
		});
		this.registerNodeListeners();
	}

	private isAbsoluteURL(url: string) {
		const rgx = new RegExp("^(?:[a-z]+:)?//", "i");
		return rgx.test(url);
	}

	handleBeforeNavigation() {
		const activeElementHref = (document.activeElement as any).getAttribute("href");
		if (activeElementHref) {
			this.eventsController.saveCapturedEventInBackground(
				ActionsInTestEnum.NAVIGATE_URL,
				document.body,
				activeElementHref
					? !this.isAbsoluteURL(activeElementHref)
						? new URL(activeElementHref, document.baseURI).toString()
						: activeElementHref
					: window.location.href.toString(),
			);
		}
	}

	turnInspectModeOnInParentFrame() {
		console.debug("Turning inspect element mode on");
		this.isInspectorMoving = true;
		(window as any).electron.host.postMessage({
			type: MESSAGE_TYPES.UPDATE_INSPECTOR_MODE_STATE,
			meta: {
				value: true,
			},
			frameId: null,
		});
	}

	turnInspectModeOffInParentFrame() {
		this.isInspectorMoving = false;
		(window as any).electron.host.postMessage({
			type: MESSAGE_TYPES.UPDATE_INSPECTOR_MODE_STATE,
			meta: {
				value: false,
			},
			frameId: null,
		});
	}

	toggleInspectorInParentFrame() {
		if (this.isInspectorMoving) {
			this.turnInspectModeOffInParentFrame();
		} else {
			this.turnInspectModeOnInParentFrame();
		}
		console.info("Info Overlay booted up");
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

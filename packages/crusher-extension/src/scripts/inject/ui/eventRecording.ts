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

	private pointerEventsMap: Array<{ data: PointerEvent }> = [];
	private recordedHoverArr: Array<any> = [];

	private hoveringState: any = {
		element: null,
		time: Date.now(),
	};

	private scrollTimer: any = null;
	private lastScrollFireTime = 0;

	private resetUserEventsToDefaultCallback: any = undefined;

	private mutationObserver: MutationObserver | null = null;

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

		this.turnOnElementModeInParentFrame = this.turnOnElementModeInParentFrame.bind(
			this,
		);
		this.handleWindowClick = this.handleWindowClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.eventsController = new EventsController(this);
		this.pollInterval = this.pollInterval.bind(this);
		this.handleDOMMutationObserverCallback = this.handleDOMMutationObserverCallback.bind(
			this,
		);
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
		this._overlayCover.style.top =
			window.scrollY + target.getBoundingClientRect().y + "px";
		this._overlayCover.style.left =
			window.scrollX + target.getBoundingClientRect().x + "px";
		this._overlayCover.style.width = target.getBoundingClientRect().width + "px";
		this._overlayCover.style.height =
			target.getBoundingClientRect().height + "px";
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
				input: this.handleKeyPress.bind(this),
				click: this.handleWindowClick.bind(this),
				contextmenu: this.onRightClick.bind(this),
			};

			if (!this.resetUserEventsToDefaultCallback) {
				this.resetUserEventsToDefaultCallback = DOM.disableAllUserEvents(
					eventExceptions,
				);
			}

			this.removeHighLightFromNode(event.target as HTMLElement);
			this.updateEventTarget(event.target as HTMLElement, event);
		}
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
					null,
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
				// 	ACTIONS_IN_TEST.HOVER,
				// 	this.hoveringState.element,
				// );
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
		if (this._overlayCover) {
			this._overlayCover.classList.remove("pointerEventsNone");
			this._overlayCover.style.left = "0px";
			this._overlayCover.style.top = "0px";
			this._overlayCover.style.width = "0px";
			this._overlayCover.style.height = "0px";
		}
	}

	// eslint-disable-next-line consistent-return
	handleWindowClick(event: any) {
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
			this.state.targetElement = target ? target : event.target;
			this._overlayCover.classList.add("pointerEventsNone");
			this.turnOnElementModeInParentFrame();
			return;
		}

		const closestLink: HTMLAnchorElement = target.closest("a");

		if (!event.simulatedEvent) {
			this.eventsController.saveCapturedEventInBackground(
				ACTIONS_IN_TEST.CLICK,
				event.target,
			);
		}
		if (closestLink && closestLink.tagName.toLowerCase() === "a") {
			const href = closestLink.getAttribute("href");
			console.log("Going to this link", href);
			if (href) {
				window.location.href = href;
			}
			return event.preventDefault();
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

	handleFocus(event: FocusEvent) {
		const target = event.target as HTMLElement;
		if (["textarea", "input"].includes(target.tagName.toLowerCase())) {
			this.eventsController.saveCapturedEventInBackground(
				ACTIONS_IN_TEST.ELEMENT_FOCUS,
				target,
				true,
			);
		}
	}

	handlePointerEnter(event: PointerEvent) {
		const timeNow = window.performance.now();

		if (this.scrollTimer) {
			return;
		}
		const lastEvent =
			this.recordedHoverArr.length > 0
				? this.recordedHoverArr[this.recordedHoverArr.length - 1]
				: null;
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

	handleDOMMutationObserverCallback(mutations: any) {
		const newMuationsList = mutations
			.map((m: MutationRecord) => {
				function getStylesMap(str: string) {
					const rgx = new RegExp(/([\w-]+)\s*:\s*([^;]+)/gm);
					const styleMatches: any = Array.from(str.matchAll(rgx));
					const styleMaps = styleMatches.reduce((prev: any, match: any) => {
						return { ...prev, [match[1]]: match[2] };
					}, {});
					return styleMaps;
				}
				function differenceInStylesMap(map1: any, map2: any) {
					const map1Keys = Object.keys(map1);
					let diff = {};
					for (let i = 0; i < map1Keys.length; i++) {
						const map1Value = map1[map1Keys[i]];
						const map2Value = map2[map1Keys[i]];
						if (!map2Value) {
							diff = {
								...diff,
								[map1Keys[i]]: { firstValue: map1Value, secondValue: map2Value },
							};
						} else if (map1Value !== map2Value) {
							diff = {
								...diff,
								[map1Keys[i]]: { firstValue: map1Value, secondValue: map2Value },
							};
						}
						delete map2[map1Keys[i]];
					}
					const map2Keys = Object.keys(map2);
					for (let i = 0; i < map2Keys.length; i++) {
						diff = {
							...diff,
							[map2Keys[i]]: { firstValue: undefined, secondValue: map2[map2Keys[i]] },
						};
					}
					return diff;
				}
				if (m.type !== "attributes") return m;
				const newAttributeValue = (m.target as any).getAttribute(m.attributeName);
				if (m.attributeName !== "style")
					return Object.assign(m, { newAttributeValue: newAttributeValue });

				const getOldStylesMap = getStylesMap(m.oldValue ? m.oldValue : "");
				const newAttributeStylesMap = getStylesMap(newAttributeValue);
				const diffMap = differenceInStylesMap(
					getOldStylesMap,
					newAttributeStylesMap,
				);
				const diffKeys = Object.keys(diffMap);

				const onlyOutlineChanged = diffKeys.filter((key) => {
					return key.startsWith("outline");
				});
				if (
					onlyOutlineChanged.length &&
					onlyOutlineChanged.length === diffKeys.length
				) {
					return null;
				}
				return Object.assign(m, {
					newAttributeValue: newAttributeValue,
					diff: [getOldStylesMap, newAttributeStylesMap, diffMap],
				});
			})
			.filter((a: any) => {
				return a !== null;
			});
		if (this.pointerEventsMap.length === 0 || newMuationsList.length === 0)
			return;
		const currentTime = window.performance.now();
		const event = this.pointerEventsMap[this.pointerEventsMap.length - 1];
		const lastHoverElement =
			this.pointerEventsMap.length > 0
				? this.pointerEventsMap[this.pointerEventsMap.length - 1]
				: null;
		if (
			currentTime - event.data.timeStamp < 50 &&
			event.data.type === "pointerenter" &&
			(event.data as any).target.id !== "overlay_cover" &&
			!this.isInspectorMoving
		) {
			if (lastHoverElement === event.data.target) {
				return;
			}
			console.log("Mutations linked to this event are: ", newMuationsList);
			this.eventsController.saveCapturedEventInBackground(
				ACTIONS_IN_TEST.HOVER,
				event.data.target,
			);
			this.pointerEventsMap = [];
		}
	}

	registerNodeListeners() {
		window.addEventListener("mousemove", this.handleMouseMove, true);
		window.addEventListener("mouseover", this.handleMouseOver, true);
		window.addEventListener("mouseout", this.handleMouseOut, true);
		window.addEventListener("contextmenu", this.onRightClick, true);
		window.addEventListener("focus", this.handleFocus, true);
		document.body.addEventListener("pointerenter", this.handlePointerEnter, true);

		this.mutationObserver = new MutationObserver(
			this.handleDOMMutationObserverCallback,
		);
		this.mutationObserver.observe(document.body, {
			attributes: true,
			childList: true,
			subtree: true,
			attributeOldValue: true,
		});

		window.addEventListener("scroll", this.handleScroll, true);

		(window as any).open = (function (open) {
			return function (url: string) {
				console.log("Opening a new tab", url);
				window.location.href = url;
			};
		})(window.open);

		window.onbeforeunload = this.handleBeforeNavigation;
		window.addEventListener("keypress", this.handleKeyPress, true);
		window.addEventListener("click", this.handleWindowClick, true);
		setInterval(this.pollInterval, 300);
	}

	removeNodeListeners() {
		window.removeEventListener("mousemove", this.handleMouseMove, true);
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

	handleBeforeNavigation() {
		const activeElementHref = (document.activeElement as any).getAttribute(
			"href",
		);

		this.eventsController.saveCapturedEventInBackground(
			ACTIONS_IN_TEST.NAVIGATE_URL,
			document.body,
			activeElementHref ? activeElementHref : window.location.href.toString(),
		);
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

	shutdown() {
		console.debug("Shutting down Recording Overlay");
		this.removeNodeListeners();

		this.state = {
			...this.state,
			sessionGoingOn: false,
		};
	}
}

import { ActionsInTestEnum, IInputNodeInfo, InputNodeTypeEnum } from "@shared/constants/recordedActions";
import { DOM } from "../utils/dom";
import EventsController from "../eventsController";
import { RelevantHoverDetection } from "./relevantHoverDetection";
import { v4 as uuidv4 } from "uuid";
import { sendRecorderReadySignal, turnOffInspectMode, turnOnElementMode, turnOnInspectMode } from "../host-proxy";
import { ElementsIdMap } from "../elementsMap";

const KEYS_TO_TRACK_FOR_INPUT = new Set(["Enter", "Escape", "Tab"]);

const KEYS_TO_TRACK_FOR_TEXTAREA = new Set([
	// Enter types a line break, shouldn't be a press.
	"Escape",
	"Tab",
]);

type iPerformActionMeta = any;

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
	private _pageRecordedEventsArr = [];
	private _clickEvents = [];

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
		const processScroll = () => {
			const target = event.target;

			const isDocumentScrolled = event.target === document;
			if (isDocumentScrolled) {
				return _this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.PAGE_SCROLL, null, window.scrollY);
			}

			const isRecorderCover = target.getAttribute("data-recorder-cover");
			if (!isRecorderCover && !event.simulatedEvent) {
				const inputNodeInfo = this._getInputNodeInfo(event.target);
				if (inputNodeInfo && [InputNodeTypeEnum.CONTENT_EDITABLE, InputNodeTypeEnum.INPUT, InputNodeTypeEnum.TEXTAREA].includes(inputNodeInfo.type))
					return;
				// @TODO: Need a proper way to detect real and fake scroll events
				_this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ELEMENT_SCROLL, event.target, event.target.scrollTop);
			} else {
				return event.preventDefault();
			}
		};

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

	async getHoverDependentNodes(_element: HTMLElement, baseLineTimeStamp: number | null = null): Promise<Array<any>> {
		// Use parent svg element if element is an svg element
		const element = _element instanceof SVGElement && _element.tagName.toLocaleLowerCase() !== "svg" ? _element.ownerSVGElement : _element;

		const needsOtherActions = await this.releventHoverDetectionManager.isCoDependentNode(element, baseLineTimeStamp, this._clickEvents);
		if (needsOtherActions) {
			const hoverNodesRecord = this.releventHoverDetectionManager.getParentDOMMutations(element, baseLineTimeStamp, this._clickEvents);
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
		const hoverNodes = this.eventsController.getRelevantHoverRecordsFromSavedEvents(await this.getHoverDependentNodes(element, baseLineTimeStamp), element);
		for (let i = 0; i < hoverNodes.length; i++) {
			await this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.HOVER, hoverNodes[i], "", null, true);
		}
	}

	async turnOnElementModeInParentFrame(selectedElement = this.state.targetElement) {
		this.isInspectorMoving = false;

		const element =
			selectedElement instanceof SVGElement && selectedElement.tagName.toLocaleLowerCase() !== "svg" ? selectedElement.ownerSVGElement : selectedElement;
		// const capturedElementScreenshot = await html2canvas(element).then((canvas: any) => canvas.toDataURL());
		const hoverDependedNodes = this.eventsController.getRelevantHoverRecordsFromSavedEvents(await this.getHoverDependentNodes(element), element) as HTMLElement[];

		const dependentHovers = hoverDependedNodes.map((node) => {
			return {
				uniqueElementId: ElementsIdMap.getUniqueId(node),
				selectors: this.eventsController.getSelectors(selectedElement),
			}
		});

		turnOnElementMode({
			uniqueElementId: ElementsIdMap.getUniqueId(selectedElement),
			selectors: this.eventsController.getSelectors(selectedElement),
			dependentHovers: dependentHovers,
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

	stopRightClickFocusLoose(event: any) {
		if (event.which === 3) {
			event.preventDefault();
		}

		console.log("Click is taking place");

		this.handleWindowClick(event);
	}

	private checkIfElementIsAnchored(target: HTMLElement) {
		// Check if element has some a tag parent
		let parent = target.parentElement;
		if(target.tagName.toLocaleLowerCase() === "a")
			return target;
		while (parent) {
			if (parent.tagName.toLowerCase() === "a") {
				return parent;
			}
			parent = parent.parentElement;
		}
		return false;
	}

	// eslint-disable-next-line consistent-return
	async handleWindowClick(event: any) {
		event.timestamp = Date.now();
		if (event.which === 3) {
			return this.onRightClick(event);
		}
		if (event.which === 2) return;

		let target = event.target;
		
		const mainAnchorNode = this.checkIfElementIsAnchored(target);
		if(mainAnchorNode) target = mainAnchorNode;

		const inputNodeInfo = this._getInputNodeInfo(target);

		const tagName = target.tagName.toLowerCase();
		if (["option", "select"].includes(tagName)) return;

		const closestLink: HTMLAnchorElement = target.tagName === "a" ? target : target.closest("a");

		// If clientX and clientY is 0 it may mean that the event is not triggered
		// by user. Found during creating tests for ielts search
		console.log("Event now", event.isTrusted, !event.simulatedEvent, event.clientX, event.clientY);
		if (!event.simulatedEvent && event.isTrusted && (event.clientX || event.clientY)) {
			this._clickEvents.push(event);
			await this.trackAndSaveRelevantHover(target, event.timeStamp);

			await this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.CLICK, target, {
				inputInfo: tagName === "label" ? inputNodeInfo : null,
			});
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
		console.log("Tracing dom mutation");
		this.releventHoverDetectionManager.registerDOMMutation({
			...event.detail,
		});
	}

	handleElementSelected(event: CustomEvent & { detail: { element: HTMLElement } }) {
		this.state.targetElement = event.detail.element;
		this.turnOnElementModeInParentFrame(event.detail.element);
		this.enableJavascriptEvents();
	}

	_getInputNodeInfo(eventNode: HTMLElement): IInputNodeInfo | null {
		const nodeTagName = eventNode.tagName.toLowerCase();

		switch (nodeTagName) {
			case "select": {
				const selectElement = event.target as HTMLSelectElement;
				const selectedOptions = selectElement.selectedOptions ? Array.from(selectElement.selectedOptions) : [];
				return { type: InputNodeTypeEnum.SELECT, value: selectedOptions.map((option, index) => option.index), name: selectElement.name };
			}
			case "input": {
				const inputElement = eventNode as HTMLInputElement;
				const inputType = inputElement.type;
				const inputName = inputElement.name;
				const parentForm = inputElement.form ? inputElement.form : document.body;

				switch (inputType) {
					case "file":
						return null;
					case "checkbox":
						return { type: InputNodeTypeEnum.CHECKBOX, value: inputElement.checked, name: inputName, inputType: inputType };
					case "radio":
						return { type: InputNodeTypeEnum.RADIO, value: inputElement.checked, name: inputName, inputType };
					default:
						// color, date, datetime, datetime-local, email, month, number, password, range, search, tel, text, time, url, week
						return { type: InputNodeTypeEnum.INPUT, value: inputElement.value, name: inputName, inputType: inputType.toLowerCase() };
				}
			}
			case "textarea": {
				const textAreaElement = eventNode as HTMLTextAreaElement;
				return { type: InputNodeTypeEnum.TEXTAREA, value: textAreaElement.value, name: textAreaElement.name };
			}
			default: {
				if (!eventNode.isContentEditable) return null;

				const contentEditableElement = eventNode as HTMLElement;

				return { type: InputNodeTypeEnum.CONTENT_EDITABLE, name: contentEditableElement.id, value: contentEditableElement.innerText };
			}
		}
	}

	async _getUniqueNodeId(node: Node) {
		const id = uuidv4();
		(window as any)[id] = node;
		return id;
	}

	async handleElementInput(event: InputEvent) {
		if (!event.isTrusted) return;
		const inputNodeInfo = this._getInputNodeInfo(event.target as HTMLElement);
		if (!inputNodeInfo || ![InputNodeTypeEnum.INPUT, InputNodeTypeEnum.TEXTAREA, InputNodeTypeEnum.CONTENT_EDITABLE].includes(inputNodeInfo.type)) return;

		const labelsArr = (event.target as HTMLInputElement).labels ? Array.from((event.target as HTMLInputElement).labels) : [];
		const labelsUniqId = [];

		for (const label of labelsArr) {
			labelsUniqId.push(await this._getUniqueNodeId(label));
		}

		this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ADD_INPUT, event.target, { ...inputNodeInfo, labelsUniqId });
	}

	async handleElementChange(event: InputEvent) {
		if (!event.isTrusted) return;
		const inputNodeInfo = await this._getInputNodeInfo(event.target as HTMLElement);
		if (!inputNodeInfo) return;
		if ([InputNodeTypeEnum.INPUT, InputNodeTypeEnum.CONTENT_EDITABLE].includes(inputNodeInfo.type)) return;

		const labelsArr = (event.target as HTMLInputElement).labels ? Array.from((event.target as HTMLInputElement).labels) : [];
		const labelsUniqId = [];

		for (const label of labelsArr) {
			labelsUniqId.push(await this._getUniqueNodeId(label));
		}
		this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ADD_INPUT, event.target, { ...inputNodeInfo, labelsUniqId });
	}

	registerNodeListeners() {
		window.addEventListener("mousemove", this.handleMouseMove, true);
		window.addEventListener("mouseover", this.handleMouseOver, true);
		window.addEventListener("mouseout", this.handleMouseOut, true);
		window.addEventListener("focus", this.handleFocus, true);
		window.addEventListener("crusherHoverTrace", this.handleCrusherHoverTrace);
		window.addEventListener("elementSelected", this.handleElementSelected);
		window.addEventListener("input", this.handleElementInput);
		window.addEventListener("change", this.handleElementChange);

		document.body.addEventListener("pointerenter", this.handlePointerEnter, true);

		window.addEventListener("scroll", this.handleScroll, true);

		window.onbeforeunload = this.handleBeforeNavigation;
		window.addEventListener("keydown", this.handleKeyDown, true);

		window.addEventListener("mousedown", this.stopRightClickFocusLoose.bind(this), true);

		window.history.pushState = new Proxy(window.history.pushState, {
			apply: async (target, thisArg, argArray) => {
				this.releventHoverDetectionManager.reset();
				const out = target.apply(thisArg, argArray);
				if(argArray[0]) {
					this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.WAIT_FOR_NAVIGATION, null, argArray[2] ? (!this.isAbsoluteURL(argArray[2])
						? new URL(argArray[2], document.baseURI).toString() : argArray[2]) : window.location.href);
				}
				return out;
			},
		});

		window.history.replaceState = new Proxy(window.history.pushState, {
			apply: async (target, thisArg, argArray) => {
				this.releventHoverDetectionManager.reset();
				const out = target.apply(thisArg, argArray);
				if(argArray[0]) {
					this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.WAIT_FOR_NAVIGATION, null, argArray[2] ?  (!this.isAbsoluteURL(argArray[2])
					? new URL(argArray[2], document.baseURI).toString() : argArray[2]) : window.location.href);
				}
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
	
		sendRecorderReadySignal();
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
				activeElementHref && activeElementHref.trim() !== ""
					? !this.isAbsoluteURL(activeElementHref)
						? new URL(activeElementHref, document.baseURI).toString()
						: activeElementHref
					: window.location.href.toString(),
			);
		} else {
			this.eventsController.saveCapturedEventInBackground(
				ActionsInTestEnum.WAIT_FOR_NAVIGATION,
				document.body,
				{ 
					url : "",
					isBeforeNavigation: true,
				}
			);
		}
	}

	turnInspectModeOnInParentFrame() {
		this.isInspectorMoving = true;
		turnOnInspectMode();
	}

	turnInspectModeOffInParentFrame() {
		this.isInspectorMoving = false;
		turnOffInspectMode();
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

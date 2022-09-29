import { ActionsInTestEnum, IInputNodeInfo, InputNodeTypeEnum } from "@shared/constants/recordedActions";
import { DOM, getElementDescription } from "../utils/dom";
import EventsController from "../eventsController";
import { RelevantHoverDetection } from "./relevantHoverDetection";
import { v4 as uuidv4 } from "uuid";
import { sendRecorderReadySignal, turnOffInspectMode, turnOnElementMode, turnOnInspectMode } from "../host-proxy";
import { ElementsIdMap } from "../elementsMap";

const KEYS_TO_TRACK_FOR_INPUT = new Set(["Enter", "Escape", "Tab"]);

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

	private pointerEventsMap: { data: PointerEvent }[] = [];
	private recordedHoverArr: any[] = [];

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

	constructor() {
		this.state = this.defaultState;

		this.onRightClick = this.onRightClick.bind(this);
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

	updateEventTarget(target: HTMLElement) {
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
		for (let i = 0; i < stack.length; ++i) stack[i]?.classList.remove("pointerEventsNone");

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
				[, target] = elements;
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

	async clickThroughElectron(node) {
		await window["crusherSdk.click"](node);
		return true;
	}

	async hoverThroughElectron(node) {
		await window["crusherSdk.hover"](node);
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
				pointerenter: this.handlePointerEnter.bind(this),
				click: this.handleWindowClick.bind(this),
			};

			if (!this.resetUserEventsToDefaultCallback) {
				this.resetUserEventsToDefaultCallback = DOM.disableAllUserEvents(eventExceptions);
			}
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
			const [target] = event.composedPath();

			const isDocumentScrolled = target === document;
			if (isDocumentScrolled) {
				return _this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.PAGE_SCROLL, null, window.scrollY);
			}

			const isRecorderCover = target.getAttribute("data-recorder-cover");
			if (!isRecorderCover && !event.simulatedEvent) {
				const inputNodeInfo = this._getInputNodeInfo(target);
				if (inputNodeInfo && [InputNodeTypeEnum.CONTENT_EDITABLE, InputNodeTypeEnum.INPUT, InputNodeTypeEnum.TEXTAREA].includes(inputNodeInfo.type))
					return;
				// @TODO: Need a proper way to detect real and fake scroll events
				_this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ELEMENT_SCROLL, target, target.scrollTop);
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

	async getHoverDependentNodes(_element: HTMLElement, baseLineTimeStamp: number | null = null): Promise<any[]> {
		// Use parent svg element if element is an svg element
		const element = _element instanceof SVGElement && _element.tagName.toLocaleLowerCase() !== "svg" ? _element.ownerSVGElement : _element;

		const needsOtherActions = await this.releventHoverDetectionManager.isCoDependentNode(element, baseLineTimeStamp, this._clickEvents);
		if (needsOtherActions) {
			const hoverNodesRecord = this.releventHoverDetectionManager.getParentDOMMutations(element, baseLineTimeStamp, this._clickEvents);
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

	async turnOnElementModeInParentFrame(selectedElement = this.state.targetElement, shouldUseAdvancedSelector: boolean) {
		this.isInspectorMoving = false;

		const element =
			selectedElement instanceof SVGElement && selectedElement.tagName.toLocaleLowerCase() !== "svg" ? selectedElement.ownerSVGElement : selectedElement;
		// const capturedElementScreenshot = await html2canvas(element).then((canvas: any) => canvas.toDataURL());

		let dependentHovers = [];
		if (!shouldUseAdvancedSelector) {
			const hoverDependedNodes = this.eventsController.getRelevantHoverRecordsFromSavedEvents(
				await this.getHoverDependentNodes(element),
				element,
			) as HTMLElement[];

			dependentHovers = hoverDependedNodes.map((node) => {
				return {
					uniqueElementId: ElementsIdMap.getUniqueId(node).value,
					selectors: this.eventsController.getSelectors(selectedElement),
				};
			});
		}

		turnOnElementMode({
			uniqueElementId: ElementsIdMap.getUniqueId(selectedElement).value,
			selectors: this.eventsController.getSelectors(selectedElement, shouldUseAdvancedSelector),
			elementDescription: getElementDescription(selectedElement),
			dependentHovers: dependentHovers,
		});
	}

	unpin() {
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

		this.handleWindowClick(event);
	}

	private checkIfElementIsAnchored(target: HTMLElement) {
		// Check if element has some a tag parent
		let parent = target.parentElement;
		if (target.tagName.toLocaleLowerCase() === "a") return target;
		while (parent) {
			if (parent.tagName.toLowerCase() === "a") {
				return parent;
			}
			parent = parent.parentElement;
		}
		return false;
	}

	lastClick = performance.now();

	// eslint-disable-next-line consistent-return
	async handleWindowClick(event: any) {
        console.log("Event here", event);
        const originalTimestamp = event.timeStamp;
        event.timestamp = Date.now();
        if (event.which === 3) {
			return this.onRightClick(event);
		}
        if (event.which === 2) return;
        if (originalTimestamp - this.lastClick < 500) return;
        this.lastClick = originalTimestamp;

        let [target] = event.composedPath();
        if (target instanceof HTMLSlotElement)
            [target] = target.assignedNodes();
        if (target.nodeType === target.TEXT_NODE)
            target = target.parentElement;

        const mainAnchorNode = this.checkIfElementIsAnchored(target);
        if (mainAnchorNode) target = mainAnchorNode;

        const inputNodeInfo = this._getInputNodeInfo(target);

        const tagName = target.tagName.toLowerCase();
        if (["option", "select"].includes(tagName)) return;

        // If clientX and clientY is 0 it may mean that the event is not triggered
        // by user. Found during creating tests for ielts search
        if (!event.simulatedEvent && event.isTrusted && (event.clientX || event.clientY)) {
			this._clickEvents.push(event);
			await this.trackAndSaveRelevantHover(target, event.timeStamp);

			let rect = target.getBoundingClientRect();
			const mousePos = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
			await this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.CLICK, target, {
				inputInfo: tagName === "label" ? inputNodeInfo : null,
				mousePos: mousePos,
			});
		}

        // if (closestLink && closestLink.tagName.toLowerCase() === "a") {
        // 	const href = closestLink.getAttribute("href");
        // 	if (href) {
        // 		window.location.href = href;
        // 		return event.preventDefault();
        // 	}
        // }
    }

	handleKeyDown(event: KeyboardEvent) {
		const {
            key
        } = event;
		if (KEYS_TO_TRACK_FOR_INPUT.has(key)) {
			this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.PRESS, event.composedPath()[0], key);
		}
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
		this.releventHoverDetectionManager.registerDOMMutation(event.detail);
	}

	handleElementSelected(event: CustomEvent & { detail: { element: HTMLElement } }) {
		this.state.targetElement = event.detail.element;
		const shouldUseAdvancedSelector = (window as any).recorder.shouldUseAdvancedSelector();
		this.turnOnElementModeInParentFrame(event.detail.element, shouldUseAdvancedSelector);
		this.enableJavascriptEvents();
	}

	_getInputNodeInfo(eventNode: HTMLElement): IInputNodeInfo | null {
		const nodeTagName = eventNode.tagName.toLowerCase();

		switch (nodeTagName) {
			case "select": {
				const selectElement = eventNode as HTMLSelectElement;
				const selectedOptions = selectElement.selectedOptions ? Array.from(selectElement.selectedOptions) : [];
				return { type: InputNodeTypeEnum.SELECT, value: selectedOptions.map(option => option.index), name: selectElement.name };
			}
			case "input": {
                const inputElement = eventNode as HTMLInputElement;
                const inputType = inputElement.type;
                const inputName = inputElement.name;

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
		const [target] = event.composedPath();

		const inputNodeInfo = this._getInputNodeInfo(target as HTMLElement);
		if (!inputNodeInfo || ![InputNodeTypeEnum.INPUT, InputNodeTypeEnum.TEXTAREA, InputNodeTypeEnum.CONTENT_EDITABLE].includes(inputNodeInfo.type)) return;

		const labelsArr = (target as HTMLInputElement).labels ? Array.from((target as HTMLInputElement).labels) : [];
		const labelsUniqId = [];

		for (const label of labelsArr) {
			labelsUniqId.push(await this._getUniqueNodeId(label));
		}

		this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ADD_INPUT, target, { ...inputNodeInfo, labelsUniqId });
	}

	async handleElementChange(event: InputEvent) {
		if (!event.isTrusted) return;
		const [target] = event.composedPath();
		const inputNodeInfo = await this._getInputNodeInfo(target as HTMLElement);
		if (!inputNodeInfo) return;
		if ([InputNodeTypeEnum.INPUT, InputNodeTypeEnum.CONTENT_EDITABLE].includes(inputNodeInfo.type)) return;

		const labelsArr = (target as HTMLInputElement).labels ? Array.from((target as HTMLInputElement).labels) : [];
		const labelsUniqId = [];

		for (const label of labelsArr) {
			labelsUniqId.push(await this._getUniqueNodeId(label));
		}
		this.eventsController.saveCapturedEventInBackground(ActionsInTestEnum.ADD_INPUT, target, { ...inputNodeInfo, labelsUniqId });
	}

	registerNodeListeners() {
		window.addEventListener("crusherHoverTrace", this.handleCrusherHoverTrace);
		window.addEventListener("elementSelected", this.handleElementSelected);
		window.addEventListener("input", this.handleElementInput);
		window.addEventListener("change", this.handleElementChange);

		window.addEventListener("pointerenter", this.handlePointerEnter, true);

		window.addEventListener("scroll", this.handleScroll, true);

		window.onbeforeunload = this.handleBeforeNavigation;
		window.addEventListener("keydown", this.handleKeyDown, true);

		window.addEventListener("pointerdown", this.stopRightClickFocusLoose.bind(this), true);

		let lastPush = Date.now();
		window.history.pushState = new Proxy(window.history.pushState, {
			apply: (target, thisArg, argArray) => {
				this.releventHoverDetectionManager.reset();
				const out = target.apply(thisArg, argArray);
				if (argArray[0]) {
					lastPush = Date.now();
					this.eventsController.saveCapturedEventInBackground(
						ActionsInTestEnum.WAIT_FOR_NAVIGATION,
						null,
						argArray[2]
							? !this.isAbsoluteURL(argArray[2])
								? new URL(argArray[2], document.baseURI).toString()
								: argArray[2]
							: window.location.href,
					);
				}
				return out;
			},
		});

		window.history.replaceState = new Proxy(window.history.pushState, {
			apply: (target, thisArg, argArray) => {
				this.releventHoverDetectionManager.reset();
				const out = target.apply(thisArg, argArray);
				if (argArray[0]) {
					lastPush = Date.now();
					this.eventsController.saveCapturedEventInBackground(
						ActionsInTestEnum.WAIT_FOR_NAVIGATION,
						null,
						argArray[2]
							? !this.isAbsoluteURL(argArray[2])
								? new URL(argArray[2], document.baseURI).toString()
								: argArray[2]
							: window.location.href,
					);
				}
				return out;
			},
		});
		setInterval(this.pollInterval, 300);
	}

	removeNodeListeners() {}

	boot(isFirstTime = false) {
		console.log("Starting...");
		this.initNodes();

		if (isFirstTime) {
			const currentURL = new URL(window.location.href);
			currentURL.searchParams.delete("__crusherAgent__");
		}

		sendRecorderReadySignal();
		this.registerNodeListeners();
	}

	private isAbsoluteURL(url: string) {
		const rgx = /^(?:[a-z]+:)?\/\//i;
		return rgx.test(url);
	}

	handleBeforeNavigation() {
		const activeElementHref = (document.activeElement as any).getAttribute("href");
		if (activeElementHref && (document.activeElement as any).getAttribute("target") !== "_blank") {
			this.eventsController.saveCapturedEventInBackground(
				ActionsInTestEnum.WAIT_FOR_NAVIGATION,
				document.body,
				activeElementHref && activeElementHref.trim() !== ""
					? !this.isAbsoluteURL(activeElementHref)
						? new URL(activeElementHref, document.baseURI).toString()
						: activeElementHref
					: window.location.href.toString(),
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

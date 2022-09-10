import EventRecording from "./ui/eventRecording";
import { getSelectors } from "./utils/selector";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { v4 as uuidv4 } from "uuid";
import { findDistanceBetweenNodes } from "./utils/helper";
import { ElementsIdMap } from "./elementsMap";
import { recordAction } from "./host-proxy";
import { getElementDescription } from "./utils/dom";

export default class EventsController {
	recordingOverlay: EventRecording;
	_recordedEvents: Array<{ eventType: string; element: Node }> = [];

	constructor(recordingOverlay: EventRecording) {
		this.recordingOverlay = recordingOverlay;
		(window as any).getSelectors = getSelectors;
	}

	getRelevantHoverRecordsFromSavedEvents(nodes: Array<Node>, rootElement: HTMLElement): Array<Node> {
		if (!this._recordedEvents.length) return nodes;

		const reverseRecordedEvents = this._recordedEvents.reverse().filter((a) => {
			return [ActionsInTestEnum.CLICK, ActionsInTestEnum.HOVER].includes(a.eventType as ActionsInTestEnum);
		});

		function getListTillNoMatching(list: Array<{ eventType: string; element: Node }>) {
			const out = [];
			for (const item of list) {
				const result = nodes.some((node) => {
					return item.element === node || node.contains(item.element);
				});
				out.push(item);
				if (!result) break;
			}
			return out;
		}

		const listTillNomatching = getListTillNoMatching(reverseRecordedEvents).reverse();

		const finalOut: Map<Node, Node> = new Map<Node, Node>();
		for (const item of listTillNomatching) {
			for (const node of nodes) {
				if (node === item.element && !finalOut.has(node)) {
					finalOut.set(node, node);
				}
			}
			if (finalOut.size === nodes.length) break;
		}

		return nodes
			.filter((a) => !finalOut.has(a))
			.map((node) => {
				const nodeDistance = findDistanceBetweenNodes(node, rootElement);
				if (nodeDistance <= 2) {
					const boundingBox = (node as HTMLElement).getBoundingClientRect();
					const centerX = boundingBox.x + boundingBox.width / 2;
					const centerY = boundingBox.y + boundingBox.height / 2;
					const nodeAtCenter = document.elementFromPoint(centerX, centerY);
					if (nodeAtCenter === rootElement) return nodeAtCenter;
				}
				return node;
			})
			.filter((e) => !!e);
	}

	simulateClickOnElement(element: any) {
		try {
			const event = new MouseEvent("click", {
				view: window,
				bubbles: true,
				cancelable: false,
			});

			// Add this property so that global click listener
			// recognizes this is ans simulated event.
			(event as any).simulatedEvent = true;
			element.dispatchEvent(event);
		} catch (err) {
			console.error(element, err);
		}
	}

	simulateHoverOnElement(el: any) {
		try {
			const event = new Event("MS");
			event.initEvent("mouseover", true, true);
			el.dispatchEvent(event);
		} catch (err) {
			console.error(el, err);
		}
	}

	getSelectorsOfNodes(nodes: Array<HTMLElement>): Array<{ selectors: Array<iSelectorInfo | null> }> {
		return nodes.map((node) => {
			const selectors = node ? getSelectors(node) : null;
			return { selectors };
		});
	}

	async _getUniqueNodeId(node: Node) {
		const id = uuidv4();
		(window as any)[id] = node;
		return id;
	}

	getRecordedEvents() {
		return this._recordedEvents;
	}

	getSelectors(_capturedTarget: any, useAdvancedSelector = false) {
		const capturedTarget =
			_capturedTarget instanceof SVGElement && _capturedTarget.tagName.toLocaleLowerCase() !== "svg" ? _capturedTarget.ownerSVGElement : _capturedTarget;

		return getSelectors(capturedTarget instanceof SVGAElement ? capturedTarget.ownerSVGElement : capturedTarget, useAdvancedSelector);
	}

	async saveCapturedEventInBackground(event_type: ActionsInTestEnum, _capturedTarget: any, value: any = "", callback?: any, shouldLogImage = true) {
		if (!(window as any).recorder.canRecordEvents()) return false;
		const capturedTarget =
			_capturedTarget instanceof SVGElement && _capturedTarget.tagName.toLocaleLowerCase() !== "svg" ? _capturedTarget.ownerSVGElement : _capturedTarget;
		const uniqueElementId = capturedTarget && ![document.body, document].includes(capturedTarget) ? ElementsIdMap.getUniqueId(capturedTarget) : null;

		const selectors = capturedTarget && uniqueElementId.isNew ? getSelectors(capturedTarget instanceof SVGAElement ? capturedTarget.ownerSVGElement : capturedTarget) : (window["crusherCacheSelectors"] ? window["crusherCacheSelectors"][uniqueElementId.value] : null);

		if(uniqueElementId.isNew && selectors) {
			if(!window["crusherCacheSelectors"]) window["crusherCacheSelectors"] = {};
			window["crusherCacheSelectors"][uniqueElementId.value] = selectors;
		}
		let capturedElementScreenshot = null;

		if (
			shouldLogImage &&
			![
				ActionsInTestEnum.NAVIGATE_URL,
				ActionsInTestEnum.PAGE_SCREENSHOT,
				ActionsInTestEnum.PAGE_SCROLL,
				ActionsInTestEnum.SET_DEVICE,
				ActionsInTestEnum.WAIT_FOR_NAVIGATION,
				ActionsInTestEnum.VALIDATE_SEO,
			].includes(event_type as any)
		) {
			console.log(capturedTarget);
			console.log("Tryng to take screenshot");
			capturedElementScreenshot = null;
			console.log("Finished");
		}

		console.log("Captured target", capturedTarget);

		this._recordedEvents.push({
			element: capturedTarget,
			eventType: event_type,
		});

		recordAction({
			type: event_type as ActionsInTestEnum,
			payload: {
				selectors: selectors,
				meta: {
					value,
					elementDescription: getElementDescription(capturedTarget),
					uniqueNodeId: uniqueElementId.value,
				},
			},
			screenshot: capturedElementScreenshot,
			url: window.location.href,
		});
	}
}

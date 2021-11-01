import EventRecording from "./ui/eventRecording";
import { getSelectors } from "../../utils/selector";
import { MESSAGE_TYPES } from "../../messageListener";
import { iAction } from "@shared/types/action";
import html2canvas from "html2canvas";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { v4 as uuidv4 } from "uuid";
import { findDistanceBetweenNodes } from "../../utils/helpers";

export default class EventsController {
	recordingOverlay: EventRecording;
	_recordedEvents: Array<{ eventType: string; element: Node }> = [];

	constructor(recordingOverlay: EventRecording) {
		this.recordingOverlay = recordingOverlay;
	}

	getRelevantHoverRecordsFromSavedEvents(nodes: Array<Node>, rootElement: HTMLElement): Array<Node> {
		console.log("Recorded events", [...this._recordedEvents], nodes);
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
		console.log("LIst till no mathcinbg", listTillNomatching);

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
			.filter((e) => !!e)
			;
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

	saveRelevantCapturedEventInBackground(finalActions: Array<any>) {
		(window as any).electron.host.postMessage({
			type: MESSAGE_TYPES.RECORD_ACTION_META,
			meta: { finalActions: finalActions },
		});
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

	async saveCapturedEventInBackground(event_type: string, capturedTarget: any, value: any = "", callback?: any, shouldLogImage = true) {
		const selectors = capturedTarget ? getSelectors(capturedTarget) : null;

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
			console.log("Finsihed");
		}

		console.log("Captured target", capturedTarget);

		this._recordedEvents.push({
			element: capturedTarget,
			eventType: event_type,
		});

		(window as any).electron.host.postMessage({
			type: MESSAGE_TYPES.RECORD_ACTION,
			meta: {
				type: event_type,
				payload: {
					selectors: selectors,
					meta: {
						value,
						uniqueNodeId:
							capturedTarget && ![document.body, document].includes(capturedTarget) ? await this._getUniqueNodeId(capturedTarget) : null,
					},
				},
				screenshot: capturedElementScreenshot,
				url: window.location.href,
			} as iAction,
		});
	}
}

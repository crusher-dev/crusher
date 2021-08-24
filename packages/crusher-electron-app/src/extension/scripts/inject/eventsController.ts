import EventRecording from "./ui/eventRecording";
import { getSelectors } from "../../utils/selector";
import { MESSAGE_TYPES } from "../../messageListener";
import { iAction } from "@shared/types/action";
import html2canvas from "html2canvas";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { iSelectorInfo } from "@shared/types/selectorInfo";

export default class EventsController {
	recordingOverlay: EventRecording;

	constructor(recordingOverlay: EventRecording) {
		this.recordingOverlay = recordingOverlay;
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

		(window as any).electron.host.postMessage({
			type: MESSAGE_TYPES.RECORD_ACTION,
			meta: {
				type: event_type,
				payload: {
					selectors: selectors,
					meta: {
						value,
					},
				},
				screenshot: capturedElementScreenshot,
				url: window.location.href,
			} as iAction,
		});
	}
}

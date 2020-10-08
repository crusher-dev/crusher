import EventRecording from "./ui/eventRecording";
import FrameStorage from "../../utils/frameStorage";
import { getSelectors } from "../../utils/selector";

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

  saveCapturedEventInBackground(
    event_type: string,
    capturedTarget: any,
    value: any = "",
    callback?: any
  ) {
    const selectors = capturedTarget ? getSelectors(capturedTarget) : null;

    window.top.postMessage(
      {
        eventType: event_type,
        // @ts-ignore
        frameId: FrameStorage.get(),
        value,
        selectors,
      },
      "*"
    );
  }
}

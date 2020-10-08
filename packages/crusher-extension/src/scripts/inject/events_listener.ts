import EventRecording from "./ui/eventRecording";
import {ACTION_TYPES} from "../../constants/actionTypes";
import LocalFrameStorage from "../../utils/frameStorage";
import {
    START_INSPECTING_RECORDING_MODE,
    START_NON_INSPECTING_RECORDING_MODE,
    NOT_RECORDING,
} from "../../constants";
import {ACTION_FORM_TYPE} from "../../ui/testRecorder/app";
import {ASSERT_TEXT} from "../../constants/domEventsToRecord";

if (top !== self) {
    fetch(chrome.runtime.getURL("iframe_inject.html") /* , options */)
        .then((response) => response.text())
        .then((html) => {
            const htmlWrapper = document.createElement("div");
            htmlWrapper.innerHTML = html;
            document.body.appendChild(htmlWrapper);

            const linkRel = document.createElement("link");
            linkRel.setAttribute("rel", "stylesheet");
            linkRel.setAttribute(
                "href",
                chrome.runtime.getURL("styles/overlay.css")
            );
            document.head.appendChild(linkRel);
        }).catch((err) => {
          console.debug("Something went wrong while appending crusher content script");
          console.error(err);
    });

    const recordingOverlay = new EventRecording({});

    window.top.postMessage(
        {
            type: ACTION_TYPES.GET_RECORDING_STATUS,
            // @ts-ignore
            frameId: LocalFrameStorage.get(),
            value: true,
        },
        "*"
    );

    window.addEventListener(
        "message",
        (message) => {
            const {type, value, formType} = message.data;
            if (!!type === false) {
                return;
            }

            if (formType === ACTION_FORM_TYPE.PAGE_ACTIONS) {
                switch (type) {
                    case ACTION_TYPES.INSPECT:
                        if (value) recordingOverlay.showEventsFormWizard();
                        else recordingOverlay.removeEventsFormWizard();
                        break;
                    case ACTION_TYPES.SCREENSHOT:
                        recordingOverlay.takePageScreenShot();
                        break;
                    case ACTION_TYPES.CAPTURE_CONSOLE:
                        recordingOverlay.saveConsoleLogsAtThisMoment();
                        break;
                    case ACTION_TYPES.GET_SEO_META:
                        const metaDesc: any = document.querySelector('meta[name="description"]');

                        window.top.postMessage(
                            {
                                type: ACTION_TYPES.SET_SEO_META,
                                // @ts-ignore
                                frameId: LocalFrameStorage.get(),
                                value: {
                                    title: document.title,
                                    description: metaDesc ? metaDesc.content : null
                                },
                            },
                            "*"
                        );
                        break;
                }
            } else if (formType === ACTION_FORM_TYPE.ELEMENT_ACTIONS) {
                recordingOverlay.hideEventsBoxIfShown();
                if (type === ASSERT_TEXT) {
                } else {
                    recordingOverlay.handleSelectedActionFromEventsList({action: type});
                }
            } else {
                switch (type) {
                    case ACTION_TYPES.GO_BACK:
                        window.history.back();
                        break;
                    case ACTION_TYPES.GO_FORWARD:
                        window.history.forward();
                        break;
                    case ACTION_TYPES.REFRESH_PAGE:
                        window.location.reload();
                        break;
                    case ACTION_TYPES.TOOGLE_INSPECTOR:
                        break;
                    case ACTION_TYPES.RECORDING_STATUS_RESPONSE:
                        const {isFromParent} = message.data;
                        if (!isFromParent) {
                            break;
                        }
                        if (
                            value === START_NON_INSPECTING_RECORDING_MODE ||
                            value === NOT_RECORDING
                        ) {
                            recordingOverlay.boot(true);
                        } else if (value === START_INSPECTING_RECORDING_MODE) {
                            recordingOverlay.boot();
                            recordingOverlay.showEventsFormWizard();
                        }
                        break;
                }
            }
        },
        false
    );

    document.addEventListener(
        "keydown",
        (event: KeyboardEvent) => {
            if (event.repeat) {
                return;
            }

            if (event.keyCode === 68 && event.shiftKey) {
                recordingOverlay.highlightInspectedElement();
            }
        },
        true
    );

    document.addEventListener(
        "keyup",
        () => {
            recordingOverlay.stopInspectorIfMoving();
        },
        true
    );
}

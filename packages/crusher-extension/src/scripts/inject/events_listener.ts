import { META_ACTIONS, SETTINGS_ACTIONS } from "../../constants/actionTypes";
import { ACTIONS_IN_TEST } from "../../../../crusher-shared/constants/recordedActions";
import EventRecording from "./ui/eventRecording";
import {
	START_INSPECTING_RECORDING_MODE,
	START_NON_INSPECTING_RECORDING_MODE,
	NOT_RECORDING,
} from "../../constants";
import { ACTION_FORM_TYPE } from "../../constants/index";
import { MESSAGE_TYPES } from "../../messageListener";
import { getFrameDepth } from "../../utils/helpers";

function boot() {
	const frameDepth = getFrameDepth(window.self);
	if (frameDepth !== 1) {
		return;
	}
	const recordingOverlay = new EventRecording({});

	window.top.postMessage(
		{
			type: MESSAGE_TYPES.REQUEST_RECORDING_STATUS,
			frameId: null,
		},
		"*",
	);

	window.addEventListener(
		"message",
		(message) => {
			const { type, value, formType } = message.data;
			if (!!type === false) {
				return;
			}

			if (formType === ACTION_FORM_TYPE.PAGE_ACTIONS) {
				switch (type) {
					case SETTINGS_ACTIONS.INSPECT_MODE_ON:
						recordingOverlay.toggleInspector();
						break;
					case SETTINGS_ACTIONS.INSPECT_MODE_OFF:
						recordingOverlay.removeEventsFormWizard();
						break;
					case SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT:
						recordingOverlay.takePageScreenShot();
						break;
					case SETTINGS_ACTIONS.START_CAPTURING_CONSOLE:
						recordingOverlay.saveConsoleLogsAtThisMoment();
						break;
					case META_ACTIONS.FETCH_SEO_META:
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						// eslint-disable-next-line no-case-declarations
						const metaTagsArray: any = [...document.querySelectorAll("meta")];
						// eslint-disable-next-line no-case-declarations
						const metaTagsValuesMap: any = metaTagsArray.reduce(
							(prev: any, current: HTMLMetaElement) => {
								const name = current.getAttribute("name");
								if (!name) {
									return prev;
								}
								return { ...prev, [name]: { name, value: current.content } };
							},
							{},
						);
						alert(JSON.stringify(metaTagsValuesMap));
						window.top.postMessage(
							{
								type: MESSAGE_TYPES.SEO_META_INFORMATION,
								frameId: null,
								value: {
									title: document.title,
									metaTags: metaTagsValuesMap,
								},
							},
							"*",
						);
						break;
				}
			} else if (formType === ACTION_FORM_TYPE.ELEMENT_ACTIONS) {
				recordingOverlay.hideEventsBoxIfShown();
				if (type !== ACTIONS_IN_TEST.ASSERT_ELEMENT) {
					recordingOverlay.handleSelectedActionFromEventsList({ action: type });
				}
			} else {
				const { isFromParent } = message.data;

				switch (type) {
					case SETTINGS_ACTIONS.GO_BACK_TO_PREVIOUS_URL:
						window.history.back();
						break;
					case SETTINGS_ACTIONS.GO_FORWARD_TO_NEXT_URL:
						window.history.forward();
						break;
					case SETTINGS_ACTIONS.REFRESH_PAGE:
						window.location.reload();
						break;
					case META_ACTIONS.FETCH_RECORDING_STATUS_RESPONSE:
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
							recordingOverlay.toggleInspector();
						}
						break;
				}
			}
		},
		false,
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
		true,
	);

	document.addEventListener(
		"keyup",
		() => {
			recordingOverlay.stopInspectorIfMoving();
		},
		true,
	);
}

if (top !== self) {
	fetch(chrome.runtime.getURL("iframe_inject.html") /* , options */)
		.then((response) => response.text())
		.then((html) => {
			const htmlWrapper = document.createElement("div");
			htmlWrapper.innerHTML = html;
			document.body.appendChild(htmlWrapper);

			const linkRel = document.createElement("link");
			linkRel.setAttribute("rel", "stylesheet");
			linkRel.setAttribute("href", chrome.runtime.getURL("styles/overlay.css"));
			document.head.appendChild(linkRel);

			boot();
		})
		.catch((err) => {
			console.debug("Something went wrong while appending crusher content script");
			console.error(err);
		});
}

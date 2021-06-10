import React, { useEffect, useRef, useState } from "react";
import Tour from "reactour";
import { getCurrentOnboardingStep } from "../../../redux/selectors/onboarding";
import { useSelector } from "react-redux";
import { getStore } from "../../../redux/store";
import { updateCurrentOnboardingStep } from "../../../redux/actions/onboarding";
import { AdvancedURL } from "../../../utils/url";
import { ELEMENT_LEVEL_ACTION } from "../../../interfaces/elementLevelAction";
import { getActionsRecordingState } from "../../../redux/selectors/recorder";
import { ACTIONS_RECORDING_STATE } from "../../../interfaces/actionsRecordingState";
import { TOP_LEVEL_ACTION } from "../../../interfaces/topLevelAction";
import { getActions } from "../../../redux/selectors/actions";
import { ACTIONS_IN_TEST } from "../../../../../crusher-shared/constants/recordedActions";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { MyCustomHelper } from "../../components/app/onboarding/tourCustomHelper";

const createOnboardingStep = (selector: string, heading: string, desc: any) => {
	return {
		selector,
		content: (
			<div style={{ paddingBottom: "0.1rem" }}>
				<div
					style={{
						fontWeight: "bold",
						fontSize: "1rem",
					}}
				>
					{heading}
				</div>
				<p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.925rem" }}>{desc}</p>
			</div>
		),
		style: {
			background: "#1A1D23",
			color: "#fff",
		},
	};
};

const ONBOARDING_STEPS: any = [
	createOnboardingStep("#address-bar",
	"Enter URL you want to test",
	"Hey lets get familiar to testing"),
	createOnboardingStep(
		"#select-device-input",
		"Select a device",
		"You can select the device you want to create test for from here. Go ahead" + "and select some device",
	),
	createOnboardingStep(
		"#device_browser",
		"Browser Frame",
		<>
			<div>This is the browser frame where you have to perform actions to record them.</div>
			<br />
			<div>Right click over an element to turn on inspector mode</div>
			<br />
			<div>Once you have turned on inspector mode, hover on an element and click on it to select it.</div>
		</>,
	),
	createOnboardingStep(`#${ELEMENT_LEVEL_ACTION.SCREENSHOT}`, "Take Screenshot", "Click on this to take screenshot of that element"),
	createOnboardingStep(`#${TOP_LEVEL_ACTION.TOGGLE_INSPECT_MODE}`, "Toggle Inspect Mode", "Now select an element using this button"),
	createOnboardingStep("#device_browser", "Select an element", "Click on an overlay to select the element again."),
	createOnboardingStep(`#${ELEMENT_LEVEL_ACTION.CLICK}`, "Click on the element", "Click on this to record click for this element"),
	createOnboardingStep(
		"#stepsListContainer",
		"Recorded Events List",
		<>
			<div>This the list of all recorded actions.</div>
			<p>Go ahead and delete any action</p>
		</>,
	),
	createOnboardingStep(`#${TOP_LEVEL_ACTION.TAKE_PAGE_SCREENSHOT}`, "Take whole page screenshot", "Click on this to take page screenshot of whole viewport."),
	createOnboardingStep("#saveTest", "Save Test", "Now click on save test to run and save this test on crusher"),
];

export const ONBOARDING_STEP_INDEX_MAP = {
	SELECT_DEVICE_INTRODUCTION: 0,
	DEVICE_BROWSER_INTRODUCTION: 1,
	TAKE_SCREENSHOT_ONBOARDING: 2,
	TOGGLE_INSPECT_BUTTON_INTRODUCTION: 3,
	SELECT_ELEMENT_USING_BUTTON: 4,
	RECORD_CLICK_ELEMENT: 5,
	ACTIONS_STEP_LIST_INTRODUCTION: 6,
	TAKE_PAGE_SCREENSHOT: 7,
	SAVE_TEST: 8,
};

const OnboardingManager = () => {
	const [isTourOpen, setIsTourOpen] = useState(false);
	const currentOnboardingStep = useSelector(getCurrentOnboardingStep);
	const actionsRecordingState = useSelector(getActionsRecordingState);
	const recordedActions = useSelector(getActions);
	const lastRecordedActionsCount = useRef(recordedActions.length);

	const handleTourComplete = () => {
		setIsTourOpen(false);
		localStorage.setItem("isOnboardingComplete", "true");
	};

	useEffect(() => {
		const store = getStore();
		switch (currentOnboardingStep) {
			case ONBOARDING_STEP_INDEX_MAP.DEVICE_BROWSER_INTRODUCTION: {
				if (actionsRecordingState.type !== ACTIONS_RECORDING_STATE.ELEMENT) break;
				store.dispatch(updateCurrentOnboardingStep(ONBOARDING_STEP_INDEX_MAP.TAKE_SCREENSHOT_ONBOARDING));
				break;
			}
			case ONBOARDING_STEP_INDEX_MAP.TAKE_SCREENSHOT_ONBOARDING: {
				if (actionsRecordingState.type !== ACTIONS_RECORDING_STATE.PAGE) break;
				store.dispatch(updateCurrentOnboardingStep(ONBOARDING_STEP_INDEX_MAP.TOGGLE_INSPECT_BUTTON_INTRODUCTION));
				break;
			}
			case ONBOARDING_STEP_INDEX_MAP.TOGGLE_INSPECT_BUTTON_INTRODUCTION: {
				if (actionsRecordingState.type !== ACTIONS_RECORDING_STATE.SELECT_ELEMENT) break;
				store.dispatch(updateCurrentOnboardingStep(ONBOARDING_STEP_INDEX_MAP.SELECT_ELEMENT_USING_BUTTON));
				break;
			}
			case ONBOARDING_STEP_INDEX_MAP.SELECT_ELEMENT_USING_BUTTON: {
				if (actionsRecordingState.type !== ACTIONS_RECORDING_STATE.ELEMENT) {
					break;
				}
				store.dispatch(updateCurrentOnboardingStep(ONBOARDING_STEP_INDEX_MAP.RECORD_CLICK_ELEMENT));
				break;
			}
			case ONBOARDING_STEP_INDEX_MAP.RECORD_CLICK_ELEMENT: {
				if (actionsRecordingState.type !== ACTIONS_RECORDING_STATE.PAGE) {
					break;
				}
				store.dispatch(updateCurrentOnboardingStep(ONBOARDING_STEP_INDEX_MAP.ACTIONS_STEP_LIST_INTRODUCTION));
				break;
			}
		}
	}, [actionsRecordingState]);

	useEffect(() => {
		const store = getStore();
		const currentCount = recordedActions.length;
		const prevCount = lastRecordedActionsCount.current;
		if (currentCount < prevCount && currentOnboardingStep === ONBOARDING_STEP_INDEX_MAP.ACTIONS_STEP_LIST_INTRODUCTION) {
			store.dispatch(updateCurrentOnboardingStep(ONBOARDING_STEP_INDEX_MAP.TAKE_PAGE_SCREENSHOT));
		} else if (currentCount > prevCount) {
			switch (currentOnboardingStep) {
				case ONBOARDING_STEP_INDEX_MAP.TAKE_PAGE_SCREENSHOT: {
					if (recordedActions[currentCount - 1].type === ACTIONS_IN_TEST.PAGE_SCREENSHOT) {
						store.dispatch(updateCurrentOnboardingStep(ONBOARDING_STEP_INDEX_MAP.SAVE_TEST));
					}
					break;
				}
			}
		}
		lastRecordedActionsCount.current = recordedActions.length;
	}, [recordedActions]);

	useEffect(() => {
		const store = getStore();

		setTimeout(() => {
			document.getElementById("saveTest")!.addEventListener("click", () => {
				handleTourComplete();
				window.location.reload();
			});
			const isDeviceAlreadyChanged = AdvancedURL.getParameterByName("isDeviceChanged", window.location.href);
			setIsTourOpen(true);
			if (isDeviceAlreadyChanged === "true") {
				store.dispatch(updateCurrentOnboardingStep(1));
			}
		}, 500);
	}, []);

	const closeTour = () => {
		setIsTourOpen(false);
	};

	const disableBody = (target: any) => disableBodyScroll(target);
	const enableBody = (target: any) => enableBodyScroll(target);

	const handleNextStep = (step: number) => {
		const store = getStore();
		store.dispatch(updateCurrentOnboardingStep(step));
	};

	return (
		<>
			<Tour
				onAfterOpen={disableBody}
				onBeforeClose={enableBody}
				steps={ONBOARDING_STEPS}
				isOpen={isTourOpen}
				onRequestClose={closeTour}
				closeWithMask={false}
				showNumber={false}
				showNavigation={true}
				disableDotsNavigation={true}
				showButtons={false}
				getCurrentStep={handleNextStep}
				goToStep={currentOnboardingStep}
				disableFocusLock={true}
				CustomHelper={MyCustomHelper}
			/>
		</>
	);
};

export { OnboardingManager };

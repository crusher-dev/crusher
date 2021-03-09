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

const ONBOARDING_STEPS: any = [
	{
		selector: "#select-device-input",
		content:
			"You can select the device you want to create test for from here. Go ahead and select some device",
	},
	{
		selector: "#device_browser",
		content: (
			<div>
				<p>
					This is the browser frame where you have to perform actions to record them.
				</p>
				<p>Right click over an element to turn on inspector mode</p>
			</div>
		),
	},
	{
		selector: `#${ELEMENT_LEVEL_ACTION.SCREENSHOT}`,
		content: (
			<div>
				<p>Click on this to take screenshot of that element</p>
			</div>
		),
	},
	{
		selector: `#${TOP_LEVEL_ACTION.TOGGLE_INSPECT_MODE}`,
		content: (
			<div>
				<p>Now select an element using this button</p>
			</div>
		),
	},
	{
		selector: "#device_browser",
		content: (
			<div>
				<p>Click on an overlay to select the element again.</p>
			</div>
		),
	},
	{
		selector: `#${ELEMENT_LEVEL_ACTION.CLICK}`,
		content: (
			<div>
				<p>Click on this to take screenshot of that element</p>
			</div>
		),
	},
	{
		selector: "#stepsListContainer",
		content: (
			<div>
				<p>This the list of all recorded actions.</p>
				<p>Go ahead and delete any action</p>
			</div>
		),
	},
	{
		selector: `#${TOP_LEVEL_ACTION.TAKE_PAGE_SCREENSHOT}`,
		content: (
			<div>
				<p>Click on this to take page screenshot of whole viewport.</p>
			</div>
		),
	},
	{
		selector: `#${TOP_LEVEL_ACTION.SHOW_SEO_MODAL}`,
		content: (
			<div>
				<p>Click on this to setup seo assertion checks.</p>
			</div>
		),
	},
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
	OPEN_SEO_ASSERTION_MODAL: 8,
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
				store.dispatch(
					updateCurrentOnboardingStep(
						ONBOARDING_STEP_INDEX_MAP.TAKE_SCREENSHOT_ONBOARDING,
					),
				);
				break;
			}
			case ONBOARDING_STEP_INDEX_MAP.TAKE_SCREENSHOT_ONBOARDING: {
				if (actionsRecordingState.type !== ACTIONS_RECORDING_STATE.PAGE) break;
				store.dispatch(
					updateCurrentOnboardingStep(
						ONBOARDING_STEP_INDEX_MAP.TOGGLE_INSPECT_BUTTON_INTRODUCTION,
					),
				);
				break;
			}
			case ONBOARDING_STEP_INDEX_MAP.TOGGLE_INSPECT_BUTTON_INTRODUCTION: {
				if (actionsRecordingState.type !== ACTIONS_RECORDING_STATE.SELECT_ELEMENT)
					break;
				store.dispatch(
					updateCurrentOnboardingStep(
						ONBOARDING_STEP_INDEX_MAP.SELECT_ELEMENT_USING_BUTTON,
					),
				);
				break;
			}
			case ONBOARDING_STEP_INDEX_MAP.SELECT_ELEMENT_USING_BUTTON: {
				if (actionsRecordingState.type !== ACTIONS_RECORDING_STATE.ELEMENT) {
					break;
				}
				store.dispatch(
					updateCurrentOnboardingStep(
						ONBOARDING_STEP_INDEX_MAP.RECORD_CLICK_ELEMENT,
					),
				);
				break;
			}
			case ONBOARDING_STEP_INDEX_MAP.RECORD_CLICK_ELEMENT: {
				if (actionsRecordingState.type !== ACTIONS_RECORDING_STATE.PAGE) {
					break;
				}
				store.dispatch(
					updateCurrentOnboardingStep(
						ONBOARDING_STEP_INDEX_MAP.ACTIONS_STEP_LIST_INTRODUCTION,
					),
				);
				break;
			}
		}
	}, [actionsRecordingState]);

	useEffect(() => {
		const store = getStore();
		const currentCount = recordedActions.length;
		const prevCount = lastRecordedActionsCount.current;
		if (
			currentCount < prevCount &&
			currentOnboardingStep ===
				ONBOARDING_STEP_INDEX_MAP.ACTIONS_STEP_LIST_INTRODUCTION
		) {
			store.dispatch(
				updateCurrentOnboardingStep(ONBOARDING_STEP_INDEX_MAP.TAKE_PAGE_SCREENSHOT),
			);
		} else if (currentCount > prevCount) {
			switch (currentOnboardingStep) {
				case ONBOARDING_STEP_INDEX_MAP.TAKE_PAGE_SCREENSHOT: {
					if (
						recordedActions[currentCount - 1].type === ACTIONS_IN_TEST.PAGE_SCREENSHOT
					) {
						handleTourComplete();
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
			const isDeviceAlreadyChanged = AdvancedURL.getParameterByName(
				"isDeviceChanged",
				window.location.href,
			);
			setIsTourOpen(true);
			if (isDeviceAlreadyChanged === "true") {
				store.dispatch(updateCurrentOnboardingStep(1));
			}
		}, 500);
	}, []);

	const closeTour = () => {
		setIsTourOpen(false);
	};

	const handleNextStep = (step: number) => {
		const store = getStore();
		store.dispatch(updateCurrentOnboardingStep(step));
	};

	return (
		<>
			<Tour
				steps={ONBOARDING_STEPS}
				isOpen={isTourOpen}
				onRequestClose={closeTour}
				closeWithMask={false}
				showNumber={false}
				getCurrentStep={handleNextStep}
				goToStep={currentOnboardingStep}
			/>
		</>
	);
};

export { OnboardingManager };

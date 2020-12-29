import React, { Ref, useEffect, useRef, useState } from "react";
import { MODALS } from "../../constants/modal";
import _devices from "../../../../crusher-shared/constants/devices";
import userAgents from "../../../../crusher-shared/constants/userAgents";
import {
	addHttpToURLIfNotThere,
	getQueryStringParams,
	resolveToBackendPath,
} from "../../../../crusher-shared/utils/url";
import {
	NOT_RECORDING,
	START_INSPECTING_RECORDING_MODE,
	START_NON_INSPECTING_RECORDING_MODE,
} from "../../constants";
import { META_ACTIONS, SETTINGS_ACTIONS } from "../../constants/actionTypes";
import { ACTIONS_IN_TEST } from "../../../../crusher-shared/constants/recordedActions";
import { sendPostDataWithForm } from "../../utils/helpers";
import { AssertModal } from "./containers/modal/assertModal";
import { SeoModal } from "./containers/modal/seoModal";
import {
	NavigateBackIcon,
	NavigateForwardIcon,
	NavigateRefreshIcon,
	RecordLabelIcon,
} from "../../assets/icons";
import { ToggleSwitchIndicator } from "./components/toggleSwitchIndicator";
import styled from "styled-components";

const devices: any = _devices;

export const ACTION_FORM_TYPE = {
	PAGE_ACTIONS: "PAGE_ACTIONS",
	ELEMENT_ACTIONS: "ELEMENT_ACTIONS",
};

function Step(props: any) {
	const { type, path, value } = props;
	return (
		<li style={styles.step}>
			<div style={styles.stepImage}>
				<img src={chrome.runtime.getURL("icons/mouse.svg")} />
			</div>
			<div style={{ ...styles.stepTextContainer }}>
				<div style={styles.stepAction}>{type}</div>
				<div style={{ overflow: "hidden" }}>
					<div style={styles.stepSelector}>{value || path}</div>
				</div>
			</div>
		</li>
	);
}

function ActionStepsList(props: any) {
	const { steps, forwardRef } = props;

	useEffect(() => {
		const testListContainer: any = document.querySelector("#stepsListContainer");
		const elementHeight = testListContainer.scrollHeight;
		testListContainer.scrollBy(0, elementHeight);
	});

	const stepList = steps.map((step: any, index: number) => {
		const { event_type, selectors, value } = step;

		return (
			<Step
				key={index}
				type={event_type}
				path={selectors && selectors[0].value}
				value={event_type === ACTIONS_IN_TEST.SCROLL ? "Performing scroll" : value}
			/>
		);
	});

	return (
		<div
			style={{
				height: "auto",
				maxHeight: 240,
				minHeight: 100,
				overflowY: "auto",
				marginBottom: "0.5rem",
				scrollBehavior: "smooth",
			}}
			id="stepsListContainer"
			ref={forwardRef}
		>
			<ul style={styles.stepsContainer} className="margin-list-item">
				{stepList}
			</ul>
		</div>
	);
}

function Actions(props: any) {
	const { iframeRef, type, isShowingElementFormCallback, updateState } = props;
	const pageActions = [
		{
			id: SETTINGS_ACTIONS.INSPECT_MODE_ON,
			value: "Element",
			icon: chrome.runtime.getURL("icons/action.svg"),
			desc: "Take screenshot, add assertion",
		},
		{
			id: SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT,
			value: "Screenshot",
			icon: chrome.runtime.getURL("icons/action.svg"),
			desc: "Take page screenshot",
		},
		{
			id: SETTINGS_ACTIONS.SHOW_SEO_MODAL,
			value: "SEO",
			icon: chrome.runtime.getURL("icons/action.svg"),
			desc: "Select Element",
		},
		// {
		//     id: ACTION_TYPES.CAPTURE_CONSOLE,
		//     value: "Console",
		//     icon: chrome.runtime.getURL("icons/action.svg")
		// }
		// ,
		// {
		//     id: ACTION_TYPES.NETWORK,
		//     value: "Network",
		//     icon: chrome.runtime.getURL("icons/action.svg")
		// }
	];

	const elementActions = [
		{
			id: SETTINGS_ACTIONS.CLICK_ON_ELEMENT,
			value: "Click",
			icon: chrome.runtime.getURL("icons/action.svg"),
			desc: "Click on the element",
		},
		{
			id: SETTINGS_ACTIONS.HOVER_ON_ELEMENT,
			value: "Hover",
			icon: chrome.runtime.getURL("icons/action.svg"),
			desc: "Add a hover action to element",
		},
		{
			id: SETTINGS_ACTIONS.TAKE_ELEMENT_SCREENSHOT,
			value: "Screenshot",
			icon: chrome.runtime.getURL("icons/action.svg"),
			desc: "Take screenshot of element",
		},
		{
			id: SETTINGS_ACTIONS.BLACKOUT_ON_ELEMENT,
			value: "Blackout",
			icon: chrome.runtime.getURL("icons/action.svg"),
			desc: "Blackout element in test results",
		},
		{
			id: SETTINGS_ACTIONS.SHOW_ASSERT_ELEMENT_MODAL,
			value: "Assert",
			icon: chrome.runtime.getURL("icons/action.svg"),
			desc: "Setup Assertion for Element",
		},
	];

	function handleElementActionClick(actionType: string, updateState: any) {
		const cn = iframeRef.current.contentWindow;
		console.log(actionType);

		// @TODO: Why are we still posting this messages to content script?
		switch (actionType) {
			case SETTINGS_ACTIONS.INSPECT_MODE_ON:
				cn.postMessage(
					{
						type: SETTINGS_ACTIONS.INSPECT_MODE_ON,
						formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
						value: true,
					},
					"*",
				);
				break;
			case SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT:
				cn.postMessage(
					{
						type: SETTINGS_ACTIONS.TAKE_PAGE_SCREENSHOT,
						formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
						value: true,
					},
					"*",
				);
				break;
			case SETTINGS_ACTIONS.SHOW_SEO_MODAL:
				cn.postMessage(
					{
						type: META_ACTIONS.FETCH_SEO_META,
						formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
						value: true,
					},
					"*",
				);
				cn.postMessage(
					{
						type: ACTIONS_IN_TEST.VALIDATE_SEO,
						formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
						value: true,
					},
					"*",
				);
				updateState(MODALS.SEO);
				break;
			case SETTINGS_ACTIONS.START_CAPTURING_CONSOLE:
				cn.postMessage(
					{
						type: ACTIONS_IN_TEST.CAPTURE_CONSOLE,
						formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
						value: true,
					},
					"*",
				);
				break;
			case SETTINGS_ACTIONS.CLICK_ON_ELEMENT:
				isShowingElementFormCallback(false);
				cn.postMessage(
					{
						type: ACTIONS_IN_TEST.CLICK,
						formType: ACTION_FORM_TYPE.ELEMENT_ACTIONS,
						value: true,
					},
					"*",
				);
				break;
			case SETTINGS_ACTIONS.HOVER_ON_ELEMENT:
				isShowingElementFormCallback(false);
				cn.postMessage(
					{
						type: ACTIONS_IN_TEST.HOVER,
						formType: ACTION_FORM_TYPE.ELEMENT_ACTIONS,
						value: true,
					},
					"*",
				);
				break;
			case SETTINGS_ACTIONS.SHOW_ASSERT_ELEMENT_MODAL:
				updateState(MODALS.ASSERT_ELEMENT);
				break;
			case SETTINGS_ACTIONS.TAKE_ELEMENT_SCREENSHOT:
				isShowingElementFormCallback(false);
				cn.postMessage(
					{
						type: ACTIONS_IN_TEST.ELEMENT_SCREENSHOT,
						formType: ACTION_FORM_TYPE.ELEMENT_ACTIONS,
						value: true,
					},
					"*",
				);
				break;
			case SETTINGS_ACTIONS.BLACKOUT_ON_ELEMENT:
				isShowingElementFormCallback(false);
				cn.postMessage(
					{
						type: ACTIONS_IN_TEST.BLACKOUT,
						formType: ACTION_FORM_TYPE.ELEMENT_ACTIONS,
						value: true,
					},
					"*",
				);
				break;
		}
	}

	const out = [];
	const actions =
		type === ACTION_FORM_TYPE.ELEMENT_ACTIONS ? elementActions : pageActions;

	for (let i = 0; i < actions.length; i++) {
		out.push(
			<div style={styles.actionRow}>
				<div
					style={{ ...styles.actionItem }}
					id={actions[i].id}
					onClick={() => {
						handleElementActionClick(actions[i].id, updateState);
					}}
				>
					<img style={styles.actionImage} src={actions[i].icon} />
					<div style={styles.actionContent}>
						<span style={styles.actionText}>{actions[i].value}</span>
						<span style={styles.actionDesc}>{actions[i].desc}</span>
					</div>
				</div>
			</div>,
		);
	}

	return (
		<div style={{ ...styles.actionListContainer, marginTop: "2rem" }}>{out}</div>
	);
}

function DesktopBrowser(props: any) {
	const { isInspectModeOn, isElementModeOn } = props;
	const selectedDeviceId = getQueryStringParams("device", window.location.href);
	const urlParams = getQueryStringParams("url", window.location.href);
	const urlEncoded = urlParams ? new URL(urlParams) : null;
	const url = urlEncoded
		? decodeURI(urlEncoded.toString().replace(/^["']/, "").replace(/["']$/, ""))
		: "https://google.com";
	const { forwardRef } = props;
	const addressInput: any = useRef(null);
	const [addressValue, setAddressValue] = useState(url);

	const deviceInfoIndex = devices.findIndex(
		(device: any) => device.id === selectedDeviceId,
	);

	const selectedDevice = deviceInfoIndex ? devices[deviceInfoIndex] : devices[8];

	const isMobile = devices
		.filter((device: any) => device.mobile === true)
		.map((device: any) => device.name)
		.includes(selectedDevice.name);

	function handleKeyDown(event: KeyboardEvent) {
		if (event.keyCode === 13) {
			setAddressValue(
				addHttpToURLIfNotThere(addressInput.current.innerText.trim()),
			);
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		const cn = forwardRef.current.contentWindow;
		if (event.key === "q") {
			cn.postMessage(
				{
					type: SETTINGS_ACTIONS.INSPECT_MODE_ON,
					formType: ACTION_FORM_TYPE.PAGE_ACTIONS,
					value: true,
				},
				"*",
			);
		}
	}

	document.body.addEventListener("keypress", handleKeyPress, true);

	function goBack() {
		const cn = forwardRef.current.contentWindow;
		cn.postMessage(
			{ type: SETTINGS_ACTIONS.GO_BACK_TO_PREVIOUS_URL, value: true },
			"*",
		);
	}

	function goForward() {
		const cn = forwardRef.current.contentWindow;
		cn.postMessage(
			{ type: SETTINGS_ACTIONS.GO_FORWARD_TO_NEXT_URL, value: true },
			"*",
		);
	}

	function refreshPage() {
		const cn = forwardRef.current.contentWindow;
		cn.postMessage({ type: SETTINGS_ACTIONS.REFRESH_PAGE, value: true }, "*");
	}

	function Addressbar() {
		const urlEncoded = new URL(addressValue);
		urlEncoded.searchParams.delete("__crusherAgent__");
		return (
			<div style={styles.addressBar}>
				<div
					style={{
						width: "1.75rem",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						paddingLeft: "0.5rem",
					}}
				>
					<img
						style={{ width: "0.8rem" }}
						src={chrome.runtime.getURL("/icons/ssl.svg")}
					/>
				</div>
				<div
					ref={addressInput}
					style={styles.addressBarInput}
					onKeyDown={handleKeyDown as any}
					contentEditable={true}
				>
					{urlEncoded.toString().substr(0, 50)}
				</div>
			</div>
		);
	}

	function Toolbar() {
		return (
			<div style={styles.browserToolbar}>
				<div style={styles.browserMainToolbar} id="top-bar">
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginLeft: "1.1rem",
						}}
					>
						<NavigateBackIcon onClick={goBack} disabled={false} />
					</div>
					<div
						style={{
							marginLeft: "1.3rem",
							display: "flex",
							alignItems: "center",
							cursor: "pointer",
						}}
					>
						<NavigateForwardIcon onClick={goForward} disabled={false} />
					</div>
					<div
						style={{
							marginLeft: "1.5rem",
							display: "flex",
							alignItems: "center",
							cursor: "pointer",
						}}
					>
						<NavigateRefreshIcon onClick={refreshPage} disabled={false} />
					</div>
					<Addressbar />
					<div style={styles.elementToggleIndicatorContainer}>
						<ToggleSwitchIndicator label="Element mode" enabled={isInspectModeOn} />
					</div>
					<div
						style={{ ...styles.button, width: "auto", marginLeft: "1.6rem" }}
						onClick={props.saveTest}
					>
						<RecordLabelIcon />
						<span style={{ marginLeft: "1.2rem" }}>Save Test</span>
					</div>
				</div>
			</div>
		);
	}

	const IframeSection = () => {
		return (
			<div style={styles.previewBrowser}>
				{isElementModeOn && (
					<div
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							width: "100%",
							height: "100%",
							background: "transparent",
							zIndex: 99999,
						}}
					></div>
				)}
				{isMobile && (
					<div
						className="smartphone"
						style={{
							width: selectedDevice.width,
							height: selectedDevice.height,
						}}
					>
						<div className="content" style={{ width: "100%", height: "100%" }}>
							<iframe
								ref={forwardRef}
								style={{
									...styles.browserFrame,
									width: "100%",
									height: "100%",
								}}
								scrolling="auto"
								sandbox="allow-scripts allow-forms allow-same-origin"
								id="screen-iframe-5984a019-7f2b-4f58-ad11-e58cc3cfa634"
								title={selectedDevice.name}
								src={addressValue}
							/>
						</div>
					</div>
				)}
				{!isMobile && (
					<iframe
						ref={forwardRef}
						style={{
							...styles.browserFrame,
							width: selectedDevice.width,
							height: selectedDevice.height,
						}}
						scrolling="auto"
						id="screen-iframe-5984a019-7f2b-4f58-ad11-e58cc3cfa634"
						sandbox="allow-scripts allow-forms allow-same-origin"
						title={selectedDevice.name}
						src={addressValue}
					/>
				)}
			</div>
		);
	};

	return (
		<div style={styles.mainContainer}>
			<div style={styles.browser}>
				<Toolbar />
				{IframeSection()}
			</div>
		</div>
	);
}

let messageListenerCallback: any = null;

window.addEventListener("message", (event) => {
	if (messageListenerCallback) {
		messageListenerCallback(event);
	}
});

function App() {
	const selectedDeviceId = getQueryStringParams("device", window.location.href);

	const [steps, setSteps] = useState([
		{
			event_type: ACTIONS_IN_TEST.SET_DEVICE,
			selectors: [{ value: "body", uniquenessScore: 1, type: "body" }],
			value: selectedDeviceId as any,
		},
	]);
	const [seoMeta, setSeoMeta] = useState({});
	const [isRecording, setIsRecording] = useState(false);
	const [isShowingElementForm, _setIsShowingElementForm] = useState(false);
	const [isUsingElementInspector] = useState(false);
	const [currentElementSelectors, setCurrentElementSelectors] = useState(null);
	const [currentElementAttributes, setCurrentElementAttributes] = useState(null);
	const [state, updateState] = useState(null);
	const [startingTime] = useState(Date.now());
	const [lastStepTime, setLastStepTime] = useState(Date.now());
	const [isInspectModeOn, setIsInspectModeOn] = useState(false);
	const [isElementModeOn, setIsElementModeOn] = useState(false);

	const iframeRef: Ref<any> = useRef(null);
	const actionsScrollRef: Ref<any> = useRef(null);

	const setIsShowingElementForm = (value: boolean) => {
		if (!value) {
			setIsInspectModeOn(false);
			setIsElementModeOn(false);
		} else {
			setIsElementModeOn(true);
		}
		_setIsShowingElementForm(value);
	};

	function getSteps() {
		return steps;
	}

	function saveSeoValidation(options: any) {
		setSteps([
			...getSteps(),
			{
				event_type: ACTIONS_IN_TEST.VALIDATE_SEO,
				value: JSON.stringify(options),
				selectors: ["body"],
			},
		] as any);
		setLastStepTime(Date.now());
		setIsShowingElementForm(false);
		updateState(null);
	}

	function saveAssertionCallback(options: any) {
		setSteps([
			...getSteps(),
			{
				event_type: ACTIONS_IN_TEST.ASSERT_ELEMENT,
				value: JSON.stringify(options),
				selectors: currentElementSelectors,
			},
		] as any);
		setLastStepTime(Date.now());
	}

	function closeAssertModalCallback() {
		const cn = (iframeRef as any).current.contentWindow;
		setIsShowingElementForm(false);

		cn.postMessage(
			{
				type: "any",
				formType: ACTION_FORM_TYPE.ELEMENT_ACTIONS,
				value: true,
			},
			"*",
		);
	}

	// @Note - Poorly written code. This is if else hell, break it down into clear pieces
	messageListenerCallback = function (event: any) {
		const { type, eventType, value, selectors } = event.data;
		console.log(type, eventType, value);
		const steps = getSteps();
		if (eventType) {
			const lastStep = steps[steps.length - 1];
			if (!lastStep) {
				setSteps([...getSteps(), { event_type: eventType, value, selectors }]);
				setLastStepTime(Date.now());
			} else {
				const navigateEventExist = steps.find(
					(step) => step.event_type === ACTIONS_IN_TEST.NAVIGATE_URL,
				);

				if (!(navigateEventExist && eventType === ACTIONS_IN_TEST.NAVIGATE_URL)) {
					if (
						eventType === ACTIONS_IN_TEST.ADD_INPUT &&
						(lastStep.event_type !== ACTIONS_IN_TEST.ADD_INPUT ||
							(lastStep.event_type === ACTIONS_IN_TEST.ADD_INPUT &&
								lastStep.selectors[0].value !== selectors[0].value))
					) {
						setSteps([
							...getSteps(),
							{ event_type: eventType, value: [value], selectors },
						]);
						setLastStepTime(Date.now());
					} else if (
						lastStep.event_type === ACTIONS_IN_TEST.ADD_INPUT &&
						eventType === ACTIONS_IN_TEST.ADD_INPUT &&
						lastStep.selectors[0].value === selectors[0].value
					) {
						steps[steps.length - 1].value = [...steps[steps.length - 1].value, value];
						setSteps(steps);
						setLastStepTime(Date.now());
					} else if (
						lastStep.event_type === ACTIONS_IN_TEST.SCROLL &&
						eventType === ACTIONS_IN_TEST.SCROLL &&
						lastStep.selectors[0] === selectors[0]
					) {
						steps[steps.length - 1] = {
							event_type: eventType,
							value: [...lastStep.value, value],
							selectors,
						};
						setSteps([...steps]);
						setLastStepTime(Date.now());
					} else {
						if (eventType === ACTIONS_IN_TEST.SCROLL) {
							setSteps([
								...getSteps(),
								{ event_type: eventType, value: [value], selectors },
							]);
							setLastStepTime(Date.now());
						} else {
							setSteps([...getSteps(), { event_type: eventType, value, selectors }]);
							setLastStepTime(Date.now());
						}
					}
				}
			}
		} else if (type) {
			const cn = iframeRef.current.contentWindow;

			const iframeURL = getQueryStringParams(
				"url",
				window.location.href,
			) as string;
			const crusherAgent = getQueryStringParams("__crusherAgent__", iframeURL);
			const userAgent = userAgents.find(
				(agent) => agent.name === (crusherAgent || userAgents[6].value),
			);

			switch (type) {
				case SETTINGS_ACTIONS.INSPECT_MODE_ON:
					setIsInspectModeOn(true);
					break;
				case SETTINGS_ACTIONS.INSPECT_MODE_OFF:
					setIsInspectModeOn(false);
					break;
				case SETTINGS_ACTIONS.SHOW_ELEMENT_FORM_IN_SIDEBAR:
					setIsShowingElementForm(true);
					setCurrentElementSelectors(selectors);
					setCurrentElementAttributes(event.data.attributes);
					break;
				case SETTINGS_ACTIONS.START_RECORDING:
					setIsRecording(true);
					break;
				// case ACTION_TYPES.TOOGLE_INSPECTOR:
				//     setIsUsingElementInspector(!isUsingElementInspector);
				//     break;
				case META_ACTIONS.FETCH_RECORDING_STATUS:
					cn.postMessage(
						{
							type: META_ACTIONS.FETCH_RECORDING_STATUS_RESPONSE,
							value: isUsingElementInspector
								? START_INSPECTING_RECORDING_MODE
								: isRecording
								? START_NON_INSPECTING_RECORDING_MODE
								: NOT_RECORDING,
							isFromParent: true,
						},
						"*",
					);
					break;
				case META_ACTIONS.FETCH_USER_AGENT:
					cn.postMessage(
						{ type: META_ACTIONS.FETCH_USER_AGENT_RESPONSE, value: userAgent },
						"*",
					);
					break;
				case META_ACTIONS.FETCH_SEO_META_RESPONSE:
					setSeoMeta({ title: value.title, metaTags: value.metaTags });
					break;
			}
		}
	};

	function saveTest() {
		sendPostDataWithForm(resolveToBackendPath("/test/goToEditor"), {
			events: escape(JSON.stringify(steps)),
			totalTime: lastStepTime - startingTime,
		});
	}

	const propsToAttachToRightSection = {
		iframeRef,
		setIsShowingElementForm,
		isShowingElementForm,
	};
	return (
		<Window style={styles.container}>
			<DesktopBrowser
				isInspectModeOn={isInspectModeOn}
				isElementModeOn={isElementModeOn}
				saveTest={saveTest}
				forwardRef={iframeRef}
			/>
			<RightSection
				state={state}
				steps={steps}
				actionsScrollRef={actionsScrollRef}
				updateState={updateState}
				{...propsToAttachToRightSection}
			/>
			<style>
				{`
                    html, body{
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        font-size: 20px;
                        overflow: hidden;
                    }
                    .margin-list-item li:not(:first-child){
                        margin-top: 0.75rem;
                    }
                    /* The device with borders */
                    .smartphone {
                        position: relative;
                        width: 360px;
                          height: 640px;
                          margin: auto;
                          border: 16px black solid;
                          border-top-width: 60px;
                          border-bottom-width: 60px;
                          border-radius: 36px;
                    }
                    
                    /* The horizontal line on the top of the device */
                    .smartphone:before {
                      content: '';
                      display: block;
                      width: 60px;
                      height: 5px;
                      position: absolute;
                      top: -30px;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      background: #333;
                      border-radius: 10px;
                    }

                    /* The circle on the bottom of the device */
                    .smartphone:after {
                      content: '';
                      display: block;
                      width: 35px;
                      height: 35px;
                      position: absolute;
                      left: 50%;
                      bottom: -65px;
                      transform: translate(-50%, -50%);
                      background: #333;
                      border-radius: 50%;
                    }

                    /* The screen (or content) of the device */
                    .smartphone .content {
                      width: 360px;
                      height: 640px;
                      background: white;
                    }
                    
                    .toggle-switch {
                        display: inline-block;
                    }
                    
                    .toggle-switch input[type=checkbox] {display:none}
                    .toggle-switch label {cursor:pointer;}
                    .toggle-switch label .toggle-track {
                        display:block;
                        height:0.625rem;
                        width: 2.7rem;
                        background:#212633;
                        border-radius:1rem;
                        position:relative;
                        padding: 0.1rem 0;
                    }

                    .toggle-switch .toggle-track:before{
                        content:'';
                        display:inline-block;
                        height:0.525rem;
                        width:0.525rem;
                        background:#5B76F7;
                        border-radius:1rem;
                        position:absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        right: calc(100% - 0.725rem);
                        transition:all .2s ease-in;
                    }

                    .toggle-switch input[type="checkbox"]:checked + label .toggle-track:before{
                        background: #5B76F7;
                        right: 0.2rem;
                    }
                `}
			</style>
			<link
				rel="stylesheet"
				href={chrome.runtime.getURL("/styles/devices.min.css")}
			/>
			<link rel="stylesheet" href={chrome.runtime.getURL("/styles/fonts.css")} />
			<AssertModal
				attributes={currentElementAttributes}
				seoMeta={seoMeta}
				state={state}
				updateState={updateState}
				saveAssertionCallback={saveAssertionCallback}
				closeModalCallback={closeAssertModalCallback}
			/>

			<SeoModal
				attributes={currentElementAttributes}
				seoMeta={seoMeta}
				state={state}
				updateState={updateState}
				saveSeoValidationCallback={saveSeoValidation}
			/>
		</Window>
	);
}

function ActionContainer(props: any) {
	const {
		updateState,
		iframeRef,
		setIsShowingElementForm,
		isShowingElementForm,
	} = props;

	const isElementSelected = isShowingElementForm;
	return isElementSelected ? (
		<>
			<div style={styles.flexRow}>
				<div style={styles.flexRowHeading}>Select Element Action</div>
			</div>
			<Actions
				type={ACTION_FORM_TYPE.ELEMENT_ACTIONS}
				isShowingElementFormCallback={setIsShowingElementForm}
				iframeRef={iframeRef}
				updateState={updateState}
			/>
		</>
	) : (
		<>
			<div style={styles.flexRow}>
				<div style={styles.flexRowHeading}>Select Action</div>
				{/* <div style={styles.flexRowRightItem}>Use template</div> */}
			</div>
			<Actions
				type={ACTION_FORM_TYPE.PAGE_ACTIONS}
				isShowingElementFormCallback={setIsShowingElementForm}
				iframeRef={iframeRef}
				updateState={updateState}
			/>
		</>
	);
}

function RightSection({
	state,
	steps,
	updateState,
	actionsScrollRef,
	iframeRef,
	setIsShowingElementForm,
	isShowingElementForm,
}: any) {
	return (
		<div style={{ ...styles.sidebar }}>
			<div style={styles.tipContainer}>
				<div style={styles.bulbIcon}>
					<img src="/icons/bulb.svg" width={31} />
				</div>
				<div style={styles.tipContent}>
					<div style={styles.tipTitle}>Tip of the session</div>
					<div style={styles.tipDesc}>Click on play to replay selected test</div>
				</div>
			</div>
			<div style={{ borderTopLeftRadius: 12, background: "#14181F" }}>
				<div
					style={{
						padding: "0rem 1.25rem",
						paddingBottom: "0rem",
						borderTopLeftRadius: 12,
					}}
				>
					<ActionStepsList forwardRef={actionsScrollRef} steps={steps} />
				</div>
				<div style={styles.actionContainer}>
					{state !== MODALS.SEO && (
						<ActionContainer
							state={state}
							updateState={updateState}
							iframeRef={iframeRef}
							isShowingElementForm={isShowingElementForm}
							setIsShowingElementForm={setIsShowingElementForm}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

const Window = styled.div`
	background: red;
	color: black;
`;

const styles: { [key: string]: React.CSSProperties } = {
	container: {
		display: "flex",
		height: "auto",
		background: "rgb(40, 40, 40)",
	},
	mainContainer: {
		flex: 1,
		width: "70%",
		maxHeight: "100vh",
		overflow: "auto",
	},
	sidebar: {
		display: "flex",
		flexDirection: "column",
		position: "fixed",
		bottom: "0",
		right: "0%",
		marginLeft: "auto",
		maxHeight: "85vh",
		maxWidth: "22rem",
		borderTopLeftRadius: 20,
		width: "25vw",
	},
	centerItemsVerticalFlex: {
		display: "flex",
		alignItems: "center",
	},
	tipContainer: {
		display: "flex",
		flexDirection: "row",
		background: "rgb(1, 1, 1)",
		borderRadius: "0.62rem 0 0 0",
		padding: "0.88rem 1.63rem",
	},
	bulbIcon: {},
	tipContent: {
		color: "#FFFFFF",
		fontFamily: "DM Sans",
		marginLeft: "0.898rem",
	},
	tipTitle: {
		fontSize: "0.66rem",
		fontWeight: "bold",
	},
	tipDesc: {
		fontSize: "0.64rem",
		marginTop: "0.1rem",
		fontWeight: 500,
	},
	sectionHeading: {
		fontFamily: "DM Sans",
		fontSize: "1rem",
		fontWeight: 700,
		marginBottom: "0",
		textAlign: "center",
		color: "#fff",
	},
	flexRow: {
		display: "flex",
		flexDirection: "row",
		fontFamily: "DM Sans",
		fontSize: "0.875rem",
		color: "#fff",
	},
	flexRowHeading: {
		color: "#fff",
		fontWeight: 700,
	},
	flexRowRightItem: {
		marginLeft: "auto",
		color: "#fff",
		fontWeight: 700,
		cursor: "pointer",
	},
	actionContainer: {
		padding: "1.1rem 1.25rem",
		position: "relative",
		background: "#1C1F26",
		marginTop: "-0.55rem",
		borderTopLeftRadius: "12px",
		overflow: "auto",
	},
	stepsContainer: {
		listStyle: "none",
		padding: 0,
	},
	step: {
		display: "flex",
		cursor: "pointer",
		fontFamily: "DM Sans",
		fontStyle: "normal",
		background: "#1C1F26",
		borderRadius: "0.25rem",
		padding: "0.6rem 0",
		overflow: "hidden",
	},
	stepImage: {
		padding: "0 0.9rem",
	},
	stepTextContainer: {},
	stepAction: {
		fontWeight: "bold",
		color: "#8C8C8C",
		fontSize: "0.8rem",
	},
	stepSelector: {
		marginTop: "0.25rem",
		color: "#8C8C8C",
		fontSize: "0.6rem",
		whiteSpace: "nowrap",
	},
	browser: {
		background: "#010101",
		minHeight: "100vh",
		overflow: "hidden",
	},
	browserToolbar: {
		display: "flex",
		flexDirection: "column",
	},
	browserMainToolbar: {
		background: "#14181F",
		display: "flex",
		padding: "0.73rem 2rem",
	},
	addressBar: {
		width: "33.9%",
		maxWidth: "25rem",
		padding: "0 0.1rem",
		background: "#1C1F26",
		overflow: "hidden",
		display: "flex",
		alignItems: "center",
		color: "#fff",
		borderRadius: "0.1rem",
		marginLeft: "1.6rem",
	},
	addressBarInput: {
		flex: 1,
		fontSize: "0.77rem",
		outline: "none",
		display: "flex",
		padding: "0.6rem 0.5rem",
		alignItems: "center",
	},
	recordingStatus: {
		background: "#1E2027",
		color: "#64707C",
		lineHeight: "1.15rem",
		fontSize: "0.6rem",
		display: "flex",
		alignItems: "center",
		fontWeight: 500,
		fontFamily: "DM Sans",
		padding: "0 0.8rem",
	},
	previewBrowser: {
		flex: 1,
		maxWidth: "75vw",
		display: "flex",
		justifyContent: "center",

		overflowY: "auto",
		background: "#010101",
		position: "relative",
		alignItems: "center",
		height: "calc(100vh - 2.58rem)",
	},
	browserFrame: {
		border: "none",
		display: "block",
		borderRadius: 2,
		width: 1480,
		maxWidth: "100%",
		height: 800,
		backgroundColor: "#fff",
	},
	elementToggleIndicatorContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: "auto",
	},
	button: {
		background: "#5B76F7",
		borderRadius: 4,
		fontWeight: 500,
		fontSize: "0.825rem",
		color: "#fff",
		fontFamily: "DM Sans",
		padding: "0.5rem 0.95rem",
		display: "flex",
		alignItems: "center",
		cursor: "pointer",
	},
	actionListContainer: {
		display: "flex",
		flexDirection: "column",
	},
	actionRow: {
		display: "flex",
		justifyContent: "space-between",
		marginBottom: "1rem",
	},
	actionItem: {
		padding: "0.8rem 0.8rem",
		fontFamily: "DM Sans",
		fontWeight: "bold",
		fontSize: "0.8rem",
		color: "#fff",
		background: "#15181E",
		borderRadius: "0.2rem",
		width: "100%",
		display: "flex",
		cursor: "pointer",
	},
	actionImage: {},
	actionContent: {
		marginLeft: "1rem",
		display: "flex",
		flexDirection: "column",
	},
	actionText: {
		fontSize: "0.9rem",
		fontFamily: "DM Sans",
	},
	actionDesc: {
		fontSize: "0.82rem",
		fontFamily: "DM Sans",
		fontWeight: 500,
		marginTop: "0.15rem",
	},
	oddItem: {
		marginRight: "1rem",
	},
	goBack: {
		fontFamily: "DM Sans",
		fontStyle: "normal",
		fontSize: "0.81rem",
		color: "#fff",
		position: "absolute",
		top: "5%",
		left: "2rem",
		cursor: "pointer",
	},
	innerForm: {},
	innerFormHeader: {
		display: "flex",
		flexDirection: "row",
		position: "relative",
	},
	innerFormHeaderIconContainer: {},
	innerFormHeaderIcon: {},
	innerFormHeaderContent: {
		flex: 1,
		marginLeft: "1.41rem",
		color: "#fff",
		fontFamily: "DM Sans",
		fontStyle: "normal",
	},
	innerFormHeaderTitle: {
		fontFamily: "DM Sans",
		fontStyle: "normal",
		fontWeight: "bold",
		color: "#fff",
		fontSize: "0.9rem",
	},
	innerFormHeaderDesc: {
		marginTop: "0.45rem",
		fontSize: "0.81rem",
	},
	innerFormHelp: {
		display: "flex",
		alignItems: "top",
		position: "absolute",
		top: "-1.2rem",
		right: "0",
		cursor: "pointer",
	},
	innerFormHelpIcon: {},
	innerFormHelpLink: {
		paddingTop: "0.4rem",
		marginLeft: "0.2rem",
		fontFamily: "DM Sans",
		fontStyle: "normal",
		fontWeight: "bold",
		color: "#fff",
		textDecorationLine: "underline",
		fontSize: "0.82rem",
	},
	inputTableGrid: {
		marginTop: "2rem",
		width: "100%",
		textAlign: "left",
		borderSpacing: "0.95rem",
		maxHeight: "47vh",
		display: "inline-block",
		overflowY: "auto",
	},
	inputTableGridItem: {
		display: "table-row",
		gridTemplateColumns: "auto auto auto",
	},
	inputTableGridItemLabel: {
		fontFamily: "DM Sans",
		minWidth: "7rem",
		fontStyle: "normal",
		fontSize: "0.82rem",
		color: "#fff",
		display: "flex",
	},
	inputTableGridOption: {
		width: "50%",
		textAlign: "right",
	},
	inputTableGridOptionValue: {
		width: "50%",

		textAlign: "right",
	},
	inputTableGridOptionValueInput: {
		padding: "0.4rem 0.7rem",
		borderRadius: "0.25rem",
		width: "100%",
		maxWidth: "10",
		fontSize: 18,
	},
	formBottomRow: {
		display: "flex",
		marginTop: "1.4rem",
	},
	formButtonAdvance: {
		fontWeight: 500,
		cursor: "pointer",
		fontSize: "0.82rem",
		color: "#5B76F7",
		textDecorationLine: "underline",
	},
	select: {
		padding: "0.4rem 0.7rem",
		borderRadius: "0.25rem",
		width: "100%",
		maxWidth: "10",
		fontSize: 18,
	},
	input: {
		padding: "0.4rem 0.7rem",
		borderRadius: "0.25rem",
		width: "100%",
		maxWidth: "10",
		fontSize: 18,
	},
};

export default App;

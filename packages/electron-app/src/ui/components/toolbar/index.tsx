import React, { memo, useContext } from "react";
import { css } from "@emotion/react";
import Input from "@dyson/components/atoms/input/Input";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { Conditional } from "@dyson/components/layouts";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { CrusherHammerIcon, DownIcon, DroppdownIconV2, LoadingIconV2, MoreIcon, NavigateBackIcon, NavigateRefreshIcon, RedDotIcon, SettingsIcon } from "../../icons";
import { BrowserButton } from "../buttons/browser.button";
import { useDispatch, batch, useSelector, useStore } from "react-redux";
import { setDevice, setSiteUrl } from "electron-app/src/store/actions/recorder";
import { devices } from "../../../devices";
import { getRecorderInfo, getRecorderInfoUrl, getRecorderState, getSavedSteps, isTestVerified } from "electron-app/src/store/selectors/recorder";
import {
	goFullScreen,
	performNavigation,
	performReloadPage,
	performResetAppSession,
	performSetDevice,
	performSteps,
	performVerifyTest,
	preformGoBackPage,
	resetTest,
	saveTest,
	updateTest,
} from "../../commands/perform";
import { addHttpToURLIfNotThere, isValidHttpUrl } from "../../../utils";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { getAppEditingSessionMeta, getProxyState, shouldShowOnboardingOverlay } from "electron-app/src/store/selectors/app";
import { SettingsModal } from "./settingsModal";
import { TourContext, useTour } from "@reactour/tour";
import { setShowShouldOnboardingOverlay } from "electron-app/src/store/actions/app";
import { sendSnackBarEvent } from "../toast";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Navigate, useNavigate } from "react-router-dom";
import { MenuDropdown } from "../../layouts/modalContainer";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { ButtonDropdown } from "electron-app/src/_ui/components/buttonDropdown";
import { DropdownIconSVG } from "@dyson/assets/icons";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { generateRandomTestName, setEndOfContenteditable } from "electron-app/src/utils/renderer";

const DeviceItem = ({ label }) => {
	return (
		<div
			css={css`
				width: 100%;
			`}
		>
			{label}
		</div>
	);
};

DeviceItem.whyDidYouRender = true;

const recorderDevices = devices
	.filter((device) => device.visible)
	.map((device) => ({
		device: device,
		value: device.id,
		label: device.name,
		component: <DeviceItem label={device.name} />,
	}));

enum ITestActionEnum {
	VERIFY_SAVE = "VERIFY_SAVE",
	VERIFY_UPDATE = "VERIFY_UPDATE",
	SAVE = "SAVE",
	UPDATE = "UPDATE"
};
const SAVE_TEST_ACTION_DROPDOWN_OPTIONS = [
	{id: ITestActionEnum.VERIFY_SAVE, content: (<span>Save</span>)},
	{id: ITestActionEnum.SAVE, content: (<span>Save</span>)}
];
const UPDATE_TEST_ACTION_DROPDOWN_OPTIONS = [
	{id: ITestActionEnum.VERIFY_UPDATE, content: (<span>Verify & Update</span>)},
	{id: ITestActionEnum.UPDATE, content: (<span>Update</span>)}
];

const SaveVerifyButton = ({ isTestVerificationComplete }) => {
	const navigate = useNavigate();
	const totalSecondsToWaitBeforeSave = 5;
	const editingSessionMeta = useSelector(getAppEditingSessionMeta);
	const { isOpen, setCurrentStep, setIsOpen } = useTour();
	const [showActionMenu, setShowActionMenu] = React.useState(false);

	const dispatch = useDispatch();
	const store = useStore();

	const handleProxyWarning = React.useCallback(() => {
		const steps = getSavedSteps(store.getState());
		const navigationStep = steps.find((step) => step.type === ActionsInTestEnum.NAVIGATE_URL);
		const startNavigationUrl = navigationStep && navigationStep.payload && navigationStep.payload.meta ? navigationStep.payload.meta.value : "";
		const startUrl = new URL(startNavigationUrl);
		const proxyState = getProxyState(store.getState());

		const hasProxyEnabled = proxyState && Object.keys(proxyState).length;
		if (startUrl.hostname.toLowerCase() === "localhost" && !hasProxyEnabled) {
			return {shouldShow: true, startUrl};
		}

		return {shouldShow: false, startUrl};
	}, []);

	const verifyTest = (autoSaveType: "UPDATE" | "SAVE", shouldAutoSave: boolean = false) => {
		localStorage.setItem("app.showShouldOnboardingOverlay", "false");
		dispatch(setShowShouldOnboardingOverlay(false));
		const recorderState = getRecorderState(store.getState());
		if (isOpen) {
			setIsOpen(false);
		}
		if (recorderState.type === TRecorderState.RECORDING_ACTIONS) {
			const proxyWarning = handleProxyWarning();
			const shouldSkipWarning = localStorage.getItem("skipProxyWarning");
			
			performVerifyTest(shouldAutoSave, autoSaveType, proxyWarning.shouldShow && !shouldSkipWarning).then((res) => {
				if (res) {
					if(res.draftJobId) {
					window["triggeredTest"] = {
						id: res.draftJobId,
					};
				}
					if(proxyWarning.shouldShow && !shouldSkipWarning && res) {
						window["showProxyWarning"] = { testId: res.id, startUrl: proxyWarning.startUrl };
					}
					sendSnackBarEvent({ type: "test_created", message: null});

					navigate("/");
					goFullScreen(false);
				}
			});
		} else {
			sendSnackBarEvent({ type: "error", message: "A action is in progress. Wait and retry again" });
		}
	};

	const saveTestToCloud = () => {
		if (isOpen) {
			setIsOpen(false);
		}

		const proxyWarning = handleProxyWarning();
		const shouldSkipWarning = localStorage.getItem("skipProxyWarning");

		saveTest(proxyWarning.shouldShow && !shouldSkipWarning)
			.then((res) => {
				if(res.draftJobId) {
					window["triggeredTest"] = { id: res.draftJobId };
				}
				if(proxyWarning.shouldShow && !shouldSkipWarning && res) {
					window["showProxyWarning"] = { testId: res.id, startUrl: proxyWarning.startUrl };
				}

				sendSnackBarEvent({ type: "test_created", message: null});
				navigate("/");
				goFullScreen(false);
			})
			.catch((err) => {
				console.error("Error is", err);
			});
	};

	const editTestInCloud = () => {
		if (isOpen) {
			setIsOpen(false);
		}

		updateTest().then((res) => {
			handleProxyWarning();
			navigate("/");
			goFullScreen(false);
		});
	};

	const handleCallback = React.useCallback(async (actionType: ITestActionEnum) => {
		switch(actionType) {
			case ITestActionEnum.UPDATE: {
				await updateTest().then((res) => {
					navigate("/");
					goFullScreen(false);
				});
				sendSnackBarEvent({ type: "success", message: "Updating test" });
				break;
			}
			case ITestActionEnum.SAVE: {
				await saveTestToCloud();
				break;
			}
			case ITestActionEnum.VERIFY_UPDATE: {
				if(isTestVerificationComplete) {
					editTestInCloud();
				} else {
					verifyTest("UPDATE", true);
				}
				break;
			}
			case ITestActionEnum.VERIFY_SAVE: {
				if(isTestVerificationComplete) {
					saveTestToCloud();
				} else {
					verifyTest("SAVE", true);
				}
				break;
			}
		}
	}, [isTestVerificationComplete]);

	return editingSessionMeta ? (
		<ButtonDropdown
			dropdownCss={buttonDropdownCss}
			css={[buttonDropdownMainButtonCss, css`width: 132rem;`]}
			options={UPDATE_TEST_ACTION_DROPDOWN_OPTIONS}
			primaryOption={isTestVerificationComplete ? ITestActionEnum.UPDATE : ITestActionEnum.VERIFY_UPDATE}
			callback={handleCallback}
		/>
	) : (
		<ButtonDropdown
			dropdownCss={buttonDropdownCss}
			wrapperCss={css`background: #B341F9; border-radius: 8rem; .dropdown-icon { background: rgba(0, 0, 0, 0.2) !important; }`}
			css={buttonDropdownMainButtonCss}
			options={SAVE_TEST_ACTION_DROPDOWN_OPTIONS}
			primaryOption={isTestVerificationComplete ? ITestActionEnum.SAVE : ITestActionEnum.VERIFY_SAVE}
			callback={handleCallback}
		/>
	);
};

const buttonDropdownCss = css`
	left: 20rem !important;
	height: max-content !important;
	top: calc(100% + 4rem) !important;
	
`;
const buttonDropdownMainButtonCss = css`
	width: 50rem;
	height: 32rem;
	padding: 0rem !important;
	background: #B341F9 !important;
	border-radius: 8rem !important;
	border-top-right-radius: 0rem !important;
    border-bottom-right-radius: 0rem !important;
`;

SaveVerifyButton.whyDidYouRender = true;

const StepActionMenu = ({ showDropDownCallback, callback }) => {
	const ActionItem = ({ title, id, callback }) => {
		return (
			<div
				css={css`
					:hover {
						background: #687ef2;
					}
				`}
				onClick={callback.bind(this, id)}
			>
				<TextBlock css={dropdownItemTextStyle}>{title}</TextBlock>
			</div>
		);
	};

	return (
		<>
			{/* <ActionItem title={"Create template"} id={GroupActionsEnum.CREATE_TEMPLATE} callback={callback}/> */}
			<ActionItem title={"Re-verify"} id={"REVERIFY"} callback={callback} />
			<ActionItem title={"Back"} id={"BACK"} callback={callback} />
			<ActionItem title={"Reset"} id={"RESET"} callback={callback} />
		</>
	);
};

const dropdownItemTextStyle = css`
	padding: 6rem 16rem;
`;

const Toolbar = (props: any) => {
	const navigate = useNavigate();

	const [url, setUrl] = React.useState("" || null);
	const [selectedDevice, setSelectedDevice] = React.useState([recorderDevices[0]]);
	const [showSettingsModal, setShowSettingsModal] = React.useState(false);
	const [urlInputError, setUrlInputError] = React.useState({ value: false, message: "" });
	const [showMenu, setShowMenu] = React.useState(false);
	const [isEditingTestName, setIsEditingTestName] = React.useState(false);
	const [testName, setTestName] = React.useState(generateRandomTestName());

	const urlInputRef = React.useRef<HTMLInputElement>(null);
	const recorderInfoUrl = useSelector(getRecorderInfoUrl);
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const isTestVerificationComplete = useSelector(isTestVerified);

	const dispatch = useDispatch();
	const store = useStore();
	const tourCont = useContext(TourContext);
	const { isOpen, currentStep, setCurrentStep } = useTour();

	React.useEffect(() => {
		if (recorderInfoUrl.url !== url) {
			setUrl(recorderInfoUrl.url);
		}
	}, [recorderInfoUrl.url]);

	const handleUrlReturn = React.useCallback(() => {
		const isOpen = tourCont.isOpen;
		const currentStep = tourCont.currentStep;
		const setCurrentStep = tourCont.setCurrentStep;

		const recorderInfo = getRecorderInfo(store.getState());
		const isOnboardingOn = shouldShowOnboardingOverlay(store.getState());

		if (urlInputRef.current?.value) {
			const validUrl = addHttpToURLIfNotThere(urlInputRef.current?.value);
			if (!isValidHttpUrl(validUrl)) {
				setUrlInputError({ value: true, message: "Please enter a valid URL" });
				urlInputRef.current.blur();
				return;
			}
			setUrlInputError({ value: false, message: "" });
			// setCurrentStep(1);
			batch(() => {
				if (!recorderInfo.url) {
					// @NOTE: Find better way to make sure initScript is done
					// webview.
					performSteps([
						{
							type: "BROWSER_SET_DEVICE",
							payload: {
								meta: {
									device: selectedDevice[0].device,
								},
							},
							time: Date.now(),
						},
						{
							type: "PAGE_NAVIGATE_URL",
							shouldNotRecord: true,
							payload: {
								selectors: [],
								meta: {
									value: "about:blank",
								},
							},
							status: "COMPLETED",
							time: Date.now(),
						},
						{
							type: "PAGE_NAVIGATE_URL",
							payload: {
								selectors: [],
								meta: {
									value: validUrl,
								},
							},
							status: "COMPLETED",
							time: Date.now(),
						},
					]);
				} else {
					performNavigation(validUrl, store);
				}
				// Just in case onboarding overlay info is still visible

				dispatch(setShowShouldOnboardingOverlay(false));

				if (isOnboardingOn && tourCont.currentStep === 0) {
					setTimeout(() => {
						setCurrentStep(1);
					}, 50);
				}
			});
		} else {
			setUrlInputError({ value: true, message: "" });
			urlInputRef.current.focus();
		}
	}, [selectedDevice]);

	const handleChangeDevice = (selected) => {
		const deviceObj = recorderDevices.find((device) => device.value === selected[0]);
		setSelectedDevice([deviceObj]);
		const recorderInfo = getRecorderInfo(store.getState());
		// if (recorderInfo.url) {
		// 	// Only perform and set if already recording
		// 	resetTest(deviceObj.device);
		// }
	};

	const isRecorderInInitialState = recorderState.type === TRecorderState.BOOTING;

	const goBack = () => {
		preformGoBackPage();
	};
	const refreshPage = () => {
		performReloadPage();
	};

	const handleCloseSettingsModal = () => {
		setShowSettingsModal(false);
	};

	const isTestBeingVerified = recorderState.type === TRecorderState.PERFORMING_ACTIONS;
	const LeftIconComponent = React.useMemo(
		() => (
			<Dropdown
				initialState={showMenu}
				// dropdownCSS={dropdownStyle}
				component={
					<StepActionMenu
						callback={(id) => {
							if (id === "REVERIFY") {
								performVerifyTest(false);
							} else if (id === "RESET") {
								performResetAppSession();
							} else if (id === "BACK") {
								goBack();
							}
							setShowMenu(false);
						}}
						showDropDownCallback={() => {
							setShowMenu(false);
						}}
					/>
				}
				callback={setShowMenu.bind(this)}
			>
				<div css={dropdownContainerStyle}>
					<MoreIcon css={dropdownMoreIconStyle} />
				</div>
			</Dropdown>
		),
		[showMenu],
	);
	const RightIconComponent = React.useMemo(
		() => {

			return (
			<div css={css`
			font-family: Gilroy;
			font-style: normal;
			font-weight: 400;
			font-size: 12.7rem;
	
			
			color: #444444;
			margin-right: 12rem;
			`}>
enter to submit
			</div>);
		},
		[selectedDevice, recorderDevices],
	);

	const handleMenuCallback = React.useCallback((value, isNavigating) => {
		if (isNavigating) {
			goFullScreen(false);
		}
	}, []);

	const handleOutsideClick = React.useCallback(() => {
			setTestName((document.querySelector(".testName") as HTMLInputElement).value);
			setIsEditingTestName(false);
			// Save the new test name somewhere
	}, [isEditingTestName]);

	const handleKeyPress = React.useCallback((e) => {
		if(e.keyCode === 13) {
			setTestName((document.querySelector(".testName") as HTMLInputElement).value);
			setIsEditingTestName(false);
		}
	});

	const handleTestNameClick = React.useCallback(() => {
		setIsEditingTestName(true);
		setTimeout(() => {
			document.querySelector(".testName").focus();
			document.execCommand('selectAll',false,null);
		}, 100);

	}, []);

	return (
		<div css={containerStyle} {...props}>
			<Conditional showIf={isTestBeingVerified}>
				<div css={testBeingVerifiedContainerStyle}>
					{/* <span
						css={drinkCupTextStyle}
					>
						Drink a cup of coffee meanwhile
					</span> */}
					<div css={verifyStatusIconStyle}>
						<LoadingIconV2 css={loadingIconStyle} />
						<span css={loadingTextStyle}>Crusher is verifying your test. </span>
					</div>
				</div>
			</Conditional>
			{/* Go Back button */}
			<Conditional showIf={!isTestBeingVerified}>
				{/* <BrowserButton
					className={"ml-24 go-back-button"}
					css={css`
						background: transparent;
					`}
					onClick={goBack}
				>
					<NavigateBackIcon
						css={css`
							height: 20rem;
						`}
						disabled={false}
					/>
				</BrowserButton> */}
				<div css={css`display: flex; align-items: center;`}>
					<MenuDropdown
						isRecorder={true}
						callback={handleMenuCallback}
						hideDropdown={true}
						css={css`
							.crusher-hammer-icon {
								margin-left: 18rem;
							}
						`}
					/>
					<div css={css`display: flex; align-items: center; font-size: 13.5rem; color: #fff; margin-left: 9rem; font-family: Gilroy; font-weight: 400; margin-top: 2rem;`}>
						<span css={css`font-size: 12rem; color: #606060;`}>tests/</span>
						<div css={css`display: flex; align-items: center;`}>
							<OnOutsideClick onOutsideClick={handleOutsideClick}>
								{isEditingTestName ? (
									<input onKeyDown={handleKeyPress} className={"testName"} css={[isEditingTestName ? css`margin-left: 5.75rem;  padding-top: 2rem; width: 90rem; height: 28rem; padding: 0rem; border-radius: 8px; padding-left: 8rem; padding-right: 8rem;  background: linear-gradient(0deg, rgba(176, 74, 255, 0.02), rgba(176, 74, 255, 0.02)), #0D0D0E;  border: 0.5px solid rgba(176, 74, 255, 0.54);` : null]} defaultValue={testName} />
								) : (
									<span css={css`margin-left: 5.75rem; color: #D2D2D2;
									border-radius: 8px;
									padding: 0rem;
									width: 94rem;
									height: 28rem;
								   background: transparent;`} onClick={handleTestNameClick}>{testName}</span>
								)}

							</OnOutsideClick>
							<DroppdownIconV2 css={css`width: 9rem; height: 6rem; margin-left: 7rem;`}/>
						</div>
						<RedDotIcon css={css`width: 6rem; height: 6rem; margin-left: 10rem;`}/>
					</div>
				</div>
			
				{/* <BrowserButton
					className={"ml-24 go-back-button"}
					css={css`
						background: transparent;
					`}
				>
					<MoreIcon
						css={css`
							height: 20rem;
						`}
						disabled={false}
					/>
				</BrowserButton> */}
				{/* Refresh button */}
				{/* <BrowserButton
					className={"ml-12 reload-page-button"}
					css={css`
						background: transparent;
					`}
					onClick={refreshPage}
				>
					<NavigateRefreshIcon
						css={css`
							height: 20rem;
						`}
						disabled={false}
					/>
				</BrowserButton> */}
				<div css={inputContainerStyle}>
					<div css={css`	display: flex;
	flex-direction: column; position: absolute; left: calc(50% + 36rem); top: 50%; transform: translate(-50%, -50%);`}>
						<Input
										placeholder="Enter URL to test"
										id={"target-site-input"}
										className={"target-site-input"}
										css={inputStyle}
										onReturn={handleUrlReturn}
										isError={urlInputError.value}
										initialValue={url}
										ref={urlInputRef}
										// leftIcon={LeftIconComponent}
										rightIcon={RightIconComponent}
									/>
									<Conditional showIf={urlInputError.value}>
										<span css={inputErrorMessageStyle}>{urlInputError.message}</span>
									</Conditional>
					</div>
			
				</div>
				<Conditional showIf={isRecorderInInitialState}>
					<Button onClick={handleUrlReturn.bind(this)} bgColor="tertiary-outline" css={buttonStyle}>
						Start
					</Button>
				</Conditional>
				<Conditional showIf={!isRecorderInInitialState}>
					{/* <div className={"ml-18 flex items-center"}>
						<div
							css={[
								onlineDotStyle,
								recorderState.type === TRecorderState.PERFORMING_ACTIONS
									? css`
											background: yellow;
									  `
									: undefined,
							]}
						/>
						<Text id="recorder-status" css={recTextStyle} className={"ml-8"}>
							{[TRecorderState.RECORDING_ACTIONS].includes(recorderState.type) ? "Rec." : "Waiting"}
						</Text>
					</div> */}

					<div className={"ml-auto flex items-center"}>
						<SettingsIcon onClick={setShowSettingsModal.bind(this, true)} css={settingsIconStyle} className={"ml-12"} />
						<div id={"verify-save-test"} css={verifySaveTestContainerStyle}>
							<SaveVerifyButton isTestVerificationComplete={isTestVerificationComplete} />
						</div>
					</div>
				</Conditional>
			</Conditional>
			<SettingsModal isOpen={showSettingsModal} handleClose={handleCloseSettingsModal} />
		</div>
	);
};

const verifySaveTestContainerStyle = css`
	margin-left: 13rem;
`;

StepActionMenu.whyDidYouRender = true;

Toolbar.whyDidYouRender = true;
const dropdownMoreIconStyle = css`
	width: 18rem;
`;
const dropdownContainerStyle = css`
	height: 100%;
	display: flex;
	align-items: center;
	background: #0d1010;
	padding: 0rem 10rem;
	border-right: 0.35px solid rgba(255, 255, 255, 0.17);
`;
const selectBoxStyle = css`
	.selectBox {
		:hover {
			border: none;
			border-left-width: 1rem;
			border-left-style: solid;
			border-left-color: rgba(255, 255, 255, 0.13);
			border-top-right-radius: 100rem;
			border-bottom-right-radius: 100rem;
		}
		input {
			width: 50rem;
			height: 30rem;
		}
		outline: none;
		padding: 14rem;
		height: 33rem !important;
		background: none;
		border-left-width: 1rem;
		border-left-style: solid;
		border-left-color: rgba(255, 255, 255, 0.13);
		border-top-right-radius: 100rem !important;
		border-bottom-right-radius: 100rem !important;
	}
	.selectBox__value {
		margin-right: 10rem;
		font-size: 13rem;
	}
	width: 104rem;
`;

const loadingTextStyle = css`
	margin-left: 12rem;
`;
const loadingIconStyle = css`
	width: 24rem;
`;

const verifyStatusIconStyle = css`
	display: flex;
	font-weight: bold;
	align-items: center;
	font-size: 14rem;
	margin-left: auto;
	margin-right: 20rem;
`;
const drinkCupTextStyle = css`
	font-size: 14rem;
	margin-left: 18rem;
`;
const testBeingVerifiedContainerStyle = css`
	display: flex;
	align-items: flex-end;
	width: 100%;
`;
const hammerIconStyle = css`
	width: 19rem;
	:hover {
		opacity: 0.8;
	}
`;
const inputContainerStyle = css`
	left: 50%;
	flex: 1;
	display: flex;
	justify-content: center;
`;

const inputErrorMessageStyle = css`
	position: absolute;
	bottom: -14rem;
	font-size: 10.5rem;
	color: #ff4583;
`;
const menuContainerStyle = css`
	font-size: 14rem;
	color: #fff;
`;
const settingsIconStyle = css`
	height: 14rem;
	path {
		fill: rgba(255, 255, 255, 0.2);
	}
	:hover {
		path {
			fill: #969696;
		}
	}
`;

const containerStyle = css`
	display: flex;
	align-items: center;
	padding: 8rem;
	background-color: #09090A;
	padding: 5rem;
	padding-left: 9rem;
	min-height: 70rem;
	position: relative;
	z-index: 999;
	padding-right: 18rem;
`;
const inputStyle = css`
	height: 40rem;
	.input__rightIconContainer {
		right: 0px;

		:hover {
			opacity: 0.8;
		}
	}
	.input__leftIconContainer {
		border-radius: 8rem 0px 0px 8rem;
		height: 85%;
		left: 1rem;
		.outsideDiv,
		.showOnClick {
			height: 100%;
		}
		/* To stop border collision */
		margin-left: 0.5rem;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;

		.dropdown-box {
			overflow: hidden;
			width: 104rem;
			margin-left: 12rem;
			z-index: 99999;
		}
	}
	& > input {
		width: 359rem;
		/* border: 1px solid #9462ff; */
		outline-color: #9462ff;
		outline-width: 1px;
		box-sizing: border-box;
		border-radius: 8rem 0px 0px 8rem;
		height: 100%;
		padding-left: 18rem;
		padding-right: 110rem;

		background: rgba(77, 77, 77, 0.2);
		border: 0.5px solid rgba(55, 55, 55, 0.4);
		border-radius: 10px;

		font-family: Gilroy;
		font-style: normal;
		font-weight: 600;
		font-size: 13rem;
		color: rgba(255, 255, 255, 0.67);

	}
	}
	.dropdown-box {
		overflow: hidden;
	}
	.input__rightIconContainer {
		right: 1rem;
		z-index: 9999;
	}
`;
const buttonStyle = css`
	font-size: 14rem;
	box-sizing: border-box;
	border-radius: 4rem;
    width: 77rem;
	height: 36rem;
`;

const saveButtonStyle = css`
	width: 116rem;
	height: 32rem;
	background: linear-gradient(0deg, #9462ff, #9462ff);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	letter-spacing: 0.3px;
	font-weight: 500 !important;
	font-size: 14rem;
	line-height: 17rem;
	border: 0.5px solid transparent;
	border-right-width: 0rem;
	border-top-right-radius: 0rem;
	border-bottom-right-radius: 0rem;
	color: #ffffff;
	:hover {
		border: 0.5px solid #8860de;
		border-right-width: 0rem;
		border-top-right-radius: 0rem;
		border-bottom-right-radius: 0rem;
	}
`;
const recTextStyle = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: normal;
	font-size: 13rem;
	line-height: 13rem;
`;
const onlineDotStyle = css`
	display: block;
	width: 8rem;
	height: 8rem;
	background: #a8e061;
	border-radius: 50rem;
	margin: 0rem;
`;

const dropDownContainer = css`
	box-sizing: border-box;
	width: 80rem;
	position: relative;
`;

export { Toolbar };
export default memo(Toolbar);

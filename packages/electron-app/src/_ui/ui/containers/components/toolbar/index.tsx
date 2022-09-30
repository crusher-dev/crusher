import React, { memo, useContext } from "react";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";
import { DroppdownIconV2, LoadingIconV2, RedDotIcon, SettingsIcon } from "../../../../constants/old_icons";
import { useDispatch, batch, useSelector, useStore } from "react-redux";
import { devices } from "../../../../../devices";
import { getRecorderInfo, getRecorderInfoUrl, getRecorderState, getSavedSteps, getTestName, isTestVerified } from "electron-app/src/store/selectors/recorder";
import { goFullScreen, performNavigation, performSteps, performVerifyTest, saveTest, updateTest, updateTestName } from "../../../../commands/perform";
import { addHttpToURLIfNotThere, isValidHttpUrl } from "../../../../../utils";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";
import { getAppEditingSessionMeta, getCurrentTestInfo, getProxyState, shouldShowOnboardingOverlay } from "electron-app/src/store/selectors/app";
import { SettingsModal } from "./settingsModal";
import { TourContext, useTour } from "@reactour/tour";
import { setCurrentTestInfo, setShowShouldOnboardingOverlay } from "electron-app/src/store/actions/app";
import { sendSnackBarEvent } from "../toast";
import { Button } from "@dyson/components/atoms";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { useNavigate } from "react-router-dom";
import { MenuDropdown } from "../../dashboard/dashboardTopMenu";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { ButtonDropdown } from "electron-app/src/_ui/ui/components/buttonDropdown";
import { OnOutsideClick } from "@dyson/components/layouts/onOutsideClick/onOutsideClick";
import { generateRandomTestName } from "electron-app/src/utils/renderer";
import { NormalInput } from "electron-app/src/_ui/ui/components/inputs/normalInput";
import { setTestName } from "electron-app/src/store/actions/recorder";

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
	UPDATE = "UPDATE",
}
const SAVE_TEST_ACTION_DROPDOWN_OPTIONS = [
	{ id: ITestActionEnum.VERIFY_SAVE, content: <span>Save</span> },
	{ id: ITestActionEnum.SAVE, content: <span>Save</span> },
];
const UPDATE_TEST_ACTION_DROPDOWN_OPTIONS = [
	{ id: ITestActionEnum.VERIFY_UPDATE, content: <span>Update</span> },
	{ id: ITestActionEnum.UPDATE, content: <span>Update</span> },
];

const SaveVerifyButton = ({ isTestVerificationComplete }) => {
	const navigate = useNavigate();
	const editingSessionMeta = useSelector(getAppEditingSessionMeta);
	const { isOpen, setIsOpen } = useTour();

	const dispatch = useDispatch();
	const store = useStore();

	const handleProxyWarning = React.useCallback(() => {
		const steps = getSavedSteps(store.getState());
		const navigationStep = steps.find((step) => step.type === ActionsInTestEnum.NAVIGATE_URL);
		const startNavigationUrl = navigationStep?.payload?.meta ? navigationStep.payload.meta.value : "";
		const startUrl = new URL(startNavigationUrl);
		const proxyState = getProxyState(store.getState());

		const hasProxyEnabled = proxyState && Object.keys(proxyState).length;
		if (startUrl.hostname.toLowerCase() === "localhost" && !hasProxyEnabled) {
			return { shouldShow: true, startUrl };
		}

		return { shouldShow: false, startUrl };
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
					if (res.draftJobId) {
						window["triggeredTest"] = {
							id: res.draftJobId,
						};
					}
					if (proxyWarning.shouldShow && !shouldSkipWarning && res) {
						window["showProxyWarning"] = { testId: res.id, startUrl: proxyWarning.startUrl };
					}
					sendSnackBarEvent({ type: "test_created", message: null });

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
				if (res.draftJobId) {
					window["triggeredTest"] = { id: res.draftJobId };
				}
				if (proxyWarning.shouldShow && !shouldSkipWarning && res) {
					window["showProxyWarning"] = { testId: res.id, startUrl: proxyWarning.startUrl };
				}

				sendSnackBarEvent({ type: "test_created", message: null });
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

		updateTest().then(() => {
			handleProxyWarning();
			navigate("/");
			goFullScreen(false);
		});
	};

	const handleCallback = React.useCallback(
		async (actionType: ITestActionEnum) => {
			switch (actionType) {
				case ITestActionEnum.UPDATE:
					await updateTest().then(() => {
						navigate("/");
						goFullScreen(false);
					});
					sendSnackBarEvent({ type: "success", message: "Updating test" });
					break;
				case ITestActionEnum.SAVE:
					await saveTestToCloud();
					break;
				case ITestActionEnum.VERIFY_UPDATE:
					if (isTestVerificationComplete) {
						editTestInCloud();
					} else {
						verifyTest("UPDATE", true);
					}
					break;
				case ITestActionEnum.VERIFY_SAVE:
					if (isTestVerificationComplete) {
						saveTestToCloud();
					} else {
						verifyTest("SAVE", true);
					}
					break;
			}
		},
		[isTestVerificationComplete],
	);

	return editingSessionMeta ? (
		<ButtonDropdown
			dropdownCss={buttonDropdownCss}
			wrapperCss={css`
				background: #b341f9;
				border-radius: 8rem;
				.dropdown-icon {
					background: rgba(0, 0, 0, 0.2) !important;
				}
			`}
			css={[
				buttonDropdownMainButtonCss,
				css`
					width: 66rem;
				`,
			]}
			options={UPDATE_TEST_ACTION_DROPDOWN_OPTIONS}
			primaryOption={isTestVerificationComplete ? ITestActionEnum.UPDATE : ITestActionEnum.VERIFY_UPDATE}
			callback={handleCallback}
		/>
	) : (
		<ButtonDropdown
			dropdownCss={buttonDropdownCss}
			wrapperCss={css`
				background: #b341f9;
				border-radius: 8rem;
				.dropdown-icon {
					background: rgba(0, 0, 0, 0.2) !important;
				}
			`}
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
	background: #b341f9 !important;
	border-radius: 8rem !important;
	border-top-right-radius: 0rem !important;
	border-bottom-right-radius: 0rem !important;
`;

SaveVerifyButton.whyDidYouRender = true;

const StepActionMenu = ({ callback }) => {
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

const useTestName = () => {
	const testName = useSelector(getTestName);
	const dispatch = useDispatch();

	React.useEffect(() => {
		// initialize the test name with a random name
		dispatch(setTestName(generateRandomTestName()));
	}, []);

	const updateTestName = (testName: string) => {
		dispatch(setTestName(testName));
	};

	return { testName, setTestName: updateTestName };
};
const Toolbar = (props: any) => {
	const [url, setUrl] = React.useState("" || null);
	const [selectedDevice] = React.useState([recorderDevices[0]]);
	const [showSettingsModal, setShowSettingsModal] = React.useState(false);
	const [urlInputError, setUrlInputError] = React.useState({ value: false, message: "" });
	const [isEditingTestName, setIsEditingTestName] = React.useState(false);
	const { testName, setTestName } = useTestName();
	const currentTestInfo = useSelector(getCurrentTestInfo);

	React.useEffect(() => {
		if (currentTestInfo) {
			setTestName(currentTestInfo.testName);
		}
	}, [currentTestInfo]);

	const urlInputRef = React.useRef<HTMLInputElement>(null);
	const recorderInfoUrl = useSelector(getRecorderInfoUrl);
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const isTestVerificationComplete = useSelector(isTestVerified);

	const dispatch = useDispatch();
	const store = useStore();
	const tourCont = useContext(TourContext);

	React.useEffect(() => {
		if (recorderInfoUrl.url !== url) {
			setUrl(recorderInfoUrl.url);
		}
	}, [recorderInfoUrl.url]);

	const handleUrlReturn = React.useCallback(() => {
		const { setCurrentStep } = tourCont;

		const recorderInfo = getRecorderInfo(store.getState());
		const isOnboardingOn = shouldShowOnboardingOverlay(store.getState());

		if (urlInputRef.current?.value) {
			const validUrl = addHttpToURLIfNotThere(urlInputRef.current?.value);
			if (!isValidHttpUrl(validUrl)) {
				setUrlInputError({ value: true, message: "Please enter a valid URL" });
				urlInputRef.current.blur();
				return;
			}
			urlInputRef.current.value = validUrl;
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

	const isRecorderInInitialState = recorderState.type === TRecorderState.BOOTING;

	const handleCloseSettingsModal = () => {
		setShowSettingsModal(false);
	};

	const isTestBeingVerified = recorderState.type === TRecorderState.PERFORMING_ACTIONS;
	const RightIconComponent = React.useMemo(() => {
		return (
			<div
				css={css`
					font-weight: 400;
					font-size: 12.7rem;

					color: #444444;
					margin-right: 12rem;
				`}
			>
				⏎ to start
			</div>
		);
	}, [selectedDevice, recorderDevices]);

	const handleMenuCallback = React.useCallback((value, isNavigating) => {
		if (isNavigating) {
			goFullScreen(false);
		}
	}, []);

	const handleOutsideClick = React.useCallback(() => {
		if (document.querySelector(".testName") as HTMLInputElement) {
			const currentTestInfo = getCurrentTestInfo(store.getState() as any);
			const testName = (document.querySelector(".testName") as HTMLInputElement).value;

			if (currentTestInfo) {
				updateTestName(currentTestInfo.id, testName);
			}
			setTestName(testName);
			setIsEditingTestName(false);
		}
		// Save the new test name somewhere
	}, [isEditingTestName]);

	const handleKeyPress = React.useCallback((e) => {
		if (e.keyCode === 13) {
			const currentTestInfo = getCurrentTestInfo(store.getState() as any);
			const testName = (document.querySelector(".testName") as HTMLInputElement).value;

			if (currentTestInfo) {
				updateTestName(currentTestInfo.id, testName);
			}
			setTestName(testName);
			setIsEditingTestName(false);
		}
	});
	const handleTestNameClick = React.useCallback(() => {
		setIsEditingTestName(true);
		setTimeout(() => {
			document.querySelector(".testName").focus();
			document.execCommand("selectAll", false, null);
		}, 100);
	}, []);

	return (
		<div css={containerStyle} {...props}>
			<div
				css={css`
					display: flex;
					align-items: center;
				`}
			>
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
				<div
					className={"mt-6 ml-10"}
					css={css`
						display: flex;
						align-items: center;
						font-size: 13.5rem;
						color: #fff;

						font-weight: 400;
					`}
				>
					<span
						css={css`
							font-size: 12rem;
							color: #606060;
						`}
					>
						tests/
					</span>
					<div
						css={css`
							display: flex;
							align-items: center;
						`}
					>
						<OnOutsideClick disable={!isEditingTestName} onOutsideClick={handleOutsideClick}>
							{isEditingTestName ? (
								<input
									onKeyDown={handleKeyPress}
									className={"testName"}
									css={[
										isEditingTestName
											? css`
													margin-left: 5.75rem;
													padding-top: 2rem;
													width: 90rem;
													height: 28rem;
													padding: 0rem;
													border-radius: 8px;
													padding-left: 8rem;
													padding-right: 8rem;
													background: linear-gradient(0deg, rgba(176, 74, 255, 0.02), rgba(176, 74, 255, 0.02)), #0d0d0d;
													border: 0.5px solid rgba(176, 74, 255, 0.54);
											  `
											: null,
									]}
									defaultValue={testName}
								/>
							) : (
								<span
									css={css`
										margin-left: 4.25rem;
										color: #d2d2d2;
										border-radius: 8px;
										padding: 0rem;
										width: 94rem;
										height: 28rem;
										background: transparent;
									`}
									onClick={handleTestNameClick}
								>
									{testName}
								</span>
							)}
						</OnOutsideClick>
					</div>
					<Conditional showIf={recorderInfo.url}>
						<div
							title={
								[TRecorderState.RECORDING_ACTIONS].includes(recorderState.type) ? "recording actions" : "waiting for current actions to finish"
							}
							className={"flex items-center"}
						>
							<RedDotIcon
								css={[
									css`
										width: 7rem;
										height: 7rem;
										margin-left: 10rem;
									`,
									[TRecorderState.RECORDING_ACTIONS].includes(recorderState.type)
										? css`
												& > rect {
													fill: #90ee90;
												}
										  `
										: undefined,
								]}
							/>
							<span className={"ml-6"} css={recorderStatusTextCss}>
								{[TRecorderState.RECORDING_ACTIONS].includes(recorderState.type) ? "recording" : "waiting"}
							</span>
						</div>
					</Conditional>
				</div>
			</div>
			<div css={inputContainerStyle}>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						position: absolute;
						left: calc(50% + 36rem);
						top: 50%;
						transform: translate(-50%, -50%);
					`}
				>
					<NormalInput
						placeholder={"Enter URL to test"}
						onReturn={handleUrlReturn}
						isError={urlInputError.value}
						initialValue={url}
						ref={urlInputRef}
						rightIcon={RightIconComponent}
					/>
					<Conditional showIf={urlInputError.value}>
						<span css={inputErrorMessageStyle}>{urlInputError.message}</span>
					</Conditional>
				</div>
			</div>

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
			<Conditional showIf={!isTestBeingVerified}>
				<Conditional showIf={isRecorderInInitialState}>
					<Button title="Create a test" onClick={handleUrlReturn.bind(this)} bgColor="tertiary-outline" css={buttonStyle}>
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

const recorderStatusTextCss = css`
	font-size: 14rem;
	color: #7c7c7c;
	:hover {
		opacity: 0.8;
	}
`;
const verifySaveTestContainerStyle = css`
	margin-left: 11rem;
`;

StepActionMenu.whyDidYouRender = true;

Toolbar.whyDidYouRender = true;

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
const testBeingVerifiedContainerStyle = css`
	display: flex;
	align-items: flex-end;
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
const settingsIconStyle = css`
	height: 15rem;
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
	background-color: #09090a;
	padding: 5rem;
	padding-left: 11rem;
	min-height: 70rem;
	position: relative;
	z-index: 999;
	padding-right: 16rem;
`;
const buttonStyle = css`
	background: #b341f9 !important;
	font-size: 14rem;
	box-sizing: border-box;
	border: 0.5px solid #b341f9 !important;
	border-radius: 8rem !important;
	width: 77rem;
	height: 36rem;
`;

export { Toolbar };
export default memo(Toolbar);

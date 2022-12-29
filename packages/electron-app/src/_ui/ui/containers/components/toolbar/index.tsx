import React, { memo, useContext, useEffect } from "react";
import { css } from "@emotion/react";
import { Conditional } from "@dyson/components/layouts";
import { LoadingIconV2, RedDotIcon, SettingsIcon } from "../../../../constants/old_icons";
import { useDispatch, batch, useSelector, useStore, shallowEqual } from "react-redux";
import { devices } from "../../../../../devices";
import { getRecorderContext, getRecorderInfo, getRecorderInfoUrl, getRecorderState, getSavedSteps, getTestName, isTestVerified } from "electron-app/src/store/selectors/recorder";
import { getTestContextVariables, goFullScreen, performExit, performNavigation, performSteps, performTrackEvent, performVerifyTest, saveTest, updateTest, updateTestName } from "../../../../../ipc/perform";
import { addHttpToURLIfNotThere, isValidHttpUrl } from "../../../../../utils";
import { TRecorderState, TRecorderVariant } from "electron-app/src/store/reducers/recorder";
import { getAppEditingSessionMeta, getCurrentTestInfo, getProxyState, shouldShowOnboardingOverlay } from "electron-app/src/store/selectors/app";
import { SettingsModal } from "./settingsModal";
import { TourContext, useTour } from "@reactour/tour";
import { setShowShouldOnboardingOverlay } from "electron-app/src/store/actions/app";
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
import ConfirmDialog from "dyson/src/components/sharedComponets/ConfirmModal";
import { getCurrentProjectConfig, getCurrentProjectConfigPath, writeProjectConfig } from "electron-app/src/_ui/utils/project";
import { DesktopAppEventsEnum } from "@shared/modules/analytics/constants";
import { ShepherdTourContext } from "react-shepherd";
import { getCurrentProjectMeta } from "electron-app/src/api/projects/integrations";
import template from "@shared/utils/templateString";

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
	const tour = React.useContext(ShepherdTourContext); 

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

	const verifyTest = async (autoSaveType: "UPDATE" | "SAVE", shouldAutoSave: boolean = false) => {
		localStorage.setItem("app.showShouldOnboardingOverlay", "false");
		dispatch(setShowShouldOnboardingOverlay(false));
		const recorderState = getRecorderState(store.getState());
		if (isOpen) {
			setIsOpen(false);
		}
		if (recorderState.type === TRecorderState.RECORDING_ACTIONS) {
			const proxyWarning = handleProxyWarning();
			let shouldNotSetupProxy: any = false;
			// Modify project config here <----
			const projectConfig = getCurrentProjectConfig();
			if (projectConfig && proxyWarning?.startUrl) {
				const hasProxySetup = projectConfig.proxy && projectConfig.proxy.find((item: any) => item.url === proxyWarning.startUrl.origin);
				if (hasProxySetup) {
					shouldNotSetupProxy = true;
				}
			}
			if (projectConfig && proxyWarning.shouldShow && proxyWarning?.startUrl && !shouldNotSetupProxy) {
				const hasOriginRecord = projectConfig.proxy && projectConfig.proxy.find((item: any) => item.url === proxyWarning.startUrl.origin);
				if(!hasOriginRecord) {
					projectConfig["proxy"] = projectConfig["proxy"] ? [
						...projectConfig["proxy"],
						{
							name: "frontend-" + projectConfig["proxy"].length + "-" + Math.floor(Math.random() * 100),
							url: proxyWarning.startUrl.origin,
							intercept: proxyWarning.startUrl.host
						}
					] : [
						{
							name: "frontend",
							url: proxyWarning.startUrl.origin,
							intercept: proxyWarning.startUrl.host
						}
					]
					writeProjectConfig(projectConfig);
				}
			}


			let shouldNotVerifyTest = false;
			const isTourActive = tour.isActive();

			if(isTourActive) {
				tour.complete();
				shouldNotVerifyTest = true;
				console.log("Test should not run");
			}

			const currentProjectMeta = await getCurrentProjectMeta();
			console.log("Project meta: ", currentProjectMeta);
			// const getCurrentProjectMeta = getCurrentProjectMetaSelector(store.getState());
			
			performVerifyTest(shouldAutoSave, autoSaveType, shouldNotVerifyTest).then((res) => {
				if (res) {
					if (res.draftJobId) {
						window["triggeredTest"] = {
							id: res.draftJobId,
						};
					}
					if (proxyWarning.shouldShow && !shouldNotSetupProxy && getCurrentProjectConfigPath() && res) {
						// sendSnackBarEvent({type: "proxy-config-modified", message: "Proxy config modified", meta: {}});
						window["showProxyWarning"] = { testId: res.id, startUrl: proxyWarning.startUrl };
					}
					sendSnackBarEvent({ type: "test_created", message: null });

					if (!isTourActive && !currentProjectMeta?.isFirstTestCreated) {
						/* @TODO: Add this workflow integration onboarding */
						// navigate(`/project-onboarding`);
					} else {
						navigate("/");
					}
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
			{ // Tracking 
				const context = getRecorderContext(store.getState() as any);
			   performTrackEvent(
				actionType === ITestActionEnum.SAVE || actionType === ITestActionEnum.VERIFY_SAVE ? DesktopAppEventsEnum.SAVE_TEST : DesktopAppEventsEnum.UPDATE_TEST,
				   {
					   context,
					   actionType
				   }
			   );
		   }

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
	const [showConfirmDialog, setShowConfirmDialog] = React.useState(null);

	React.useEffect(() => {
		if (currentTestInfo) {
			setTestName(currentTestInfo.testName);
		}
	}, [currentTestInfo]);

	const urlInputRef = React.useRef<HTMLInputElement>(null);
	const recorderInfoUrl = useSelector(getRecorderInfoUrl);
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const isTestVerificationComplete = true;
	const recorderContext = useSelector(getRecorderContext);

	const dispatch = useDispatch();
	const store = useStore();
	const tourCont = useContext(TourContext);
	const navigate = useNavigate();

	React.useEffect(() => {
		if (recorderInfoUrl.url !== url) {
			setUrl(recorderInfoUrl.url);
		}
	}, [recorderInfoUrl.url]);

	const handleUrlReturn = React.useCallback(async () => {
		const { setCurrentStep } = tourCont;

		const recorderInfo = getRecorderInfo(store.getState());
		const isOnboardingOn = shouldShowOnboardingOverlay(store.getState());

		if (urlInputRef.current?.value) {
			const initialUrl = urlInputRef.current?.value;
			const finalUrl = template(urlInputRef.current?.value, { ctx: await getTestContextVariables()});
			const validUrl = addHttpToURLIfNotThere(finalUrl);
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
							payload: {
								selectors: [],
								meta: {
									value: initialUrl,
								},
							},
							status: "COMPLETED",
							time: Date.now(),
						},
					]);
				} else {
					const recorderState = getRecorderState(store.getState());
					if (recorderState.type === TRecorderState.RECORDING_ACTIONS) {
						performNavigation(validUrl, store);
					} else {
						sendSnackBarEvent({ type: "error", message: "A action is in progress. Wait and retry again" });

					}
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

	const handleMenuCallback = React.useCallback((value, evt) => {
		if (evt?.id === "exit" && recorderInfo.url) {
			evt.preventDefault();
			setShowConfirmDialog({ evt });
		}

		if (evt?.isNavigating) {
			if (evt?.id === "settings") {
				evt.preventDefault();
				setShowSettingsModal(true);
			} else {
				if (recorderInfo.url) {
					evt.preventDefault();
					setShowConfirmDialog({ evt });
				} else {
					goFullScreen(false);
				}
			}
		}
	}, [recorderInfo]);

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

	const handleConfirmAccept = React.useCallback(() => {
		const evt = showConfirmDialog.evt;
		setShowConfirmDialog(null);
		console.log("Evt accept", evt);
		if (evt.id === "exit") {
			performExit();
		}
		if (evt.id === "back-to-dashboard") {
			navigate("/");
		}
		if (evt.isNavigating) {
			goFullScreen(false);
		}
	}, [showConfirmDialog]);

	useEffect(() => {
		requestAnimationFrame(() => {
			urlInputRef.current.focus()
		})
	}, [])
	return (
		<div css={containerStyle} {...props}>
			{showConfirmDialog ? (<ConfirmDialog action={showConfirmDialog.evt.action} onAcceptClick={handleConfirmAccept} onOpenChange={(isOpen) => { if (!isOpen) setShowConfirmDialog(null); }} />) : ""}
			<div
				css={css`
					display: flex;
					align-items: center;
				`}
			>
				<MenuDropdown
					isRecorder={true}
					callback={handleMenuCallback}
					css={css`
						.crusher-hammer-icon {
							margin-left: 18rem;
						}
					`}
				/>
				<div className={"mt-2 ml-10 flex items-center"}>

					<TextBlock fontSize={13} color="#606060">tests/</TextBlock>
					<div className="flex items-center">
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
													font-size: 13rem;
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
								<TextBlock className="ml-4" onClick={handleTestNameClick} fontSize={13} color="#d2d2d2">{testName}</TextBlock>

							)}
						</OnOutsideClick>
					</div>
					<Conditional showIf={recorderInfo.url}>
						<div
							title={
								[TRecorderState.RECORDING_ACTIONS].includes(recorderState.type) ? "recording actions" : "waiting for current actions to finish"
							}
							css={css`    margin-top: -2px;`}
							className={"flex items-center"}
						>
							<RedDotIcon
								css={[
									css`
										width: 8rem;
										height: 8rem;
										margin-left: 10rem;
									`,
									recorderContext.variant !== TRecorderVariant.LOCAL_BUILD && [TRecorderState.RECORDING_ACTIONS].includes(recorderState.type)
										? css`
												& > rect {
													fill: #83EA5E;
												}
										  `
										: undefined,
								]}
							/>
							<span className={"ml-6 recorder-status"} css={recorderStatusTextCss}>
								{ recorderContext.variant === TRecorderVariant.LOCAL_BUILD ? "replaying" : (
									[TRecorderState.RECORDING_ACTIONS].includes(recorderState.type) ? "recording" : "waiting"
								) }
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
						className={"url-input"}
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

<div id={"test-actions"}>
			<Conditional showIf={isTestBeingVerified}>
				<div css={testBeingVerifiedContainerStyle}>
					<div css={verifyStatusIconStyle}>
						<LoadingIconV2 css={loadingIconStyle} />
						<TextBlock color="grey" fontSize={14}>Running test steps</TextBlock>
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
					<div className={"ml-auto flex items-center"}>
						<SettingsIcon onClick={setShowSettingsModal.bind(this, true)} css={settingsIconStyle} className={"ml-12"} />
						<div id={"verify-save-test"} css={verifySaveTestContainerStyle}>
							<SaveVerifyButton isTestVerificationComplete={isTestVerificationComplete} />
						</div>
					</div>
				</Conditional>
			</Conditional></div>
			<SettingsModal isOpen={showSettingsModal} handleClose={handleCloseSettingsModal} />
		</div >
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


const loadingIconStyle = css`
	width: 24rem;
`;

const verifyStatusIconStyle = css`
	display: flex;
	font-weight: bold;
	align-items: center;
	font-size: 14rem;
	margin-left: auto;
	gap: 08rem;
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
	min-height: 72rem;
	position: relative;
	z-index: 999;
	border-bottom:  3rem solid #141414;
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

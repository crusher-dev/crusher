import React, { memo, useContext } from "react";
import { css } from "@emotion/react";
import Input from "@dyson/components/atoms/input/Input";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { Conditional } from "@dyson/components/layouts";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { CrusherHammerIcon, DownIcon, LoadingIconV2, MoreIcon, NavigateBackIcon, NavigateRefreshIcon, SettingsIcon } from "../../icons";
import { BrowserButton } from "../buttons/browser.button";
import { useDispatch, batch, useSelector, useStore } from "react-redux";
import { setDevice, setSiteUrl } from "electron-app/src/store/actions/recorder";
import { devices } from "../../../devices";
import { getRecorderInfo, getRecorderInfoUrl, getRecorderState, isTestVerified } from "electron-app/src/store/selectors/recorder";
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
import { getAppEditingSessionMeta } from "electron-app/src/store/selectors/app";
import { SettingsModal } from "./settingsModal";
import { TourContext, useTour } from "@reactour/tour";
import { setShowShouldOnboardingOverlay } from "electron-app/src/store/actions/app";
import { sendSnackBarEvent } from "../toast";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";
import { Navigate, useNavigate } from "react-router-dom";
import { MenuDropdown } from "../../layouts/modalContainer";

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

function ActionButtonDropdown({ setShowActionMenu, ...props }) {
	const editingSessionMeta = useSelector(getAppEditingSessionMeta);
	const navigate = useNavigate();

	const MenuItem = ({ label, onClick, ...props }) => {
		return (
			<div
				css={css`
					padding: 8rem 12rem;
					:hover {
						background: #687ef2 !important;
					}
				`}
				onClick={onClick}
			>
				{label}
			</div>
		);
	};

	const handleSave = () => {
		setShowActionMenu(false);
		saveTest().then((res) => {
			window["triggeredTest"] = { id: res.draftJobId };
			navigate("/");
			goFullScreen(false);
		});
		sendSnackBarEvent({ type: "success", message: "Saving test..." });
	};
	const handleUpdate = () => {
		setShowActionMenu(false);
		updateTest().then((res) => {
			navigate("/");
			goFullScreen(false);
		});;
		sendSnackBarEvent({ type: "success", message: "Updating test" });
	};
	return (
		<div
			className={"flex flex-col justify-between h-full"}
			css={css`
				font-size: 13rem;
				color: #fff;
			`}
		>
			<div>
				<MenuItem onClick={handleSave} label={"Save"} className={"close-on-click"} />
				<Conditional showIf={editingSessionMeta && !!editingSessionMeta.testId}>
					<MenuItem onClick={handleUpdate} label={"Update"} className={"close-on-click"} />
				</Conditional>
			</div>
		</div>
	);
}

ActionButtonDropdown.whyDidYouRender = true;

const SaveVerifyButton = ({ isTestVerificationComplete }) => {
	const intervalRef = React.useRef(null);
	const navigate = useNavigate();
	const totalSecondsToWaitBeforeSave = 5;
	const editingSessionMeta = useSelector(getAppEditingSessionMeta);
	const { isOpen, setCurrentStep, setIsOpen } = useTour();
	const [showActionMenu, setShowActionMenu] = React.useState(false);

	const dispatch = useDispatch();
	const store = useStore();

	const verifyTest = () => {
		localStorage.setItem("app.showShouldOnboardingOverlay", "false");
		dispatch(setShowShouldOnboardingOverlay(false));
		const recorderState = getRecorderState(store.getState());
		if (isOpen) {
			setIsOpen(false);
		}
		if (recorderState.type === TRecorderState.RECORDING_ACTIONS) {
			performVerifyTest().then((res) => {
				if(res && res.draftJobId) {
					window["triggeredTest"] = { id: res.draftJobId };
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

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		intervalRef.current = null;
		saveTest().then((res) => {
			console.log("Naviagting to", res);
			window["triggeredTest"] = { id: res.draftJobId };
			navigate("/");
			goFullScreen(false);
		}).catch((err) => {
			console.error("Error is", err);
		});
	};

	const editTestInCloud = () => {
		if (isOpen) {
			setIsOpen(false);
		}

		updateTest().then((res) => {
			navigate("/");
			goFullScreen(false);
		});
	};

	return (
		<>
			<Dropdown
				initialState={showActionMenu}
				component={<ActionButtonDropdown setShowActionMenu={setShowActionMenu.bind(this)} />}
				callback={setShowActionMenu.bind(this)}
				dropdownCSS={css`
					left: 32rem;
					width: 162rem;
				`}
			>
				<Conditional showIf={!editingSessionMeta}>
					<Button
						id={"verify-save-test"}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							if (isTestVerificationComplete) {
								saveTestToCloud();
							} else {
								verifyTest();
							}
						}}
						bgColor="tertiary-outline"
						css={saveButtonStyle}
						className={"ml-36"}
					>
						<Conditional showIf={isTestVerificationComplete}>
							<span>
								<span>Save test</span>
							</span>
						</Conditional>
						<Conditional showIf={!isTestVerificationComplete}>
							<span>Verify & Save</span>
						</Conditional>
					</Button>
				</Conditional>

				<Conditional showIf={!!editingSessionMeta}>
					<Button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							if (isTestVerificationComplete) {
								editTestInCloud();
							} else {
								verifyTest();
							}
						}}
						bgColor="tertiary-outline"
						css={saveButtonStyle}
						className={"ml-36"}
					>
						<Conditional showIf={isTestVerificationComplete}>
							<span>
								<span>Update test</span>
							</span>
						</Conditional>
						<Conditional showIf={!isTestVerificationComplete}>
							<span>Verify & Update</span>
						</Conditional>
					</Button>
				</Conditional>
				<div
					css={css`
						background: #9461ff;
						display: flex;
						align-items: center;
						padding: 0rem 9rem;
						border-top-right-radius: 6rem;
						border-bottom-right-radius: 6rem;
						border-left-color: #00000036;
						border-left-width: 2.5rem;
						border-left-style: solid;
						:hover {
							opacity: 0.8;
						}
					`}
				>
					<DownIcon
						fill={"#fff"}
						css={css`
							width: 9rem;
						`}
					/>
				</div>
			</Dropdown>
		</>
	);
};

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

	const urlInputRef = React.useRef<HTMLInputElement>(null);
	const recorderInfoUrl = useSelector(getRecorderInfoUrl);
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const isTestVerificationComplete = useSelector(isTestVerified);

	const dispatch = useDispatch();
	const store = useStore();
	const tourCont = useContext(TourContext)
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

		if (urlInputRef.current?.value) {
			const validUrl = addHttpToURLIfNotThere(urlInputRef.current?.value);
			if (!isValidHttpUrl(validUrl)) {
				setUrlInputError({ value: true, message: "Please enter a valid URL" });
				urlInputRef.current.blur();
				return;
			}
			setUrlInputError({ value: false, message: "" });
			batch(() => {
				if (!recorderInfo.url) {
					console.log("Selected device is", selectedDevice[0]);
					// @NOTE: Find better way to make sure initScript is done
					// webview.
					performSteps([{
						"type": "BROWSER_SET_DEVICE",
						"payload": {
							"meta": {
								"device": selectedDevice[0].device
							}
						},
						"time": Date.now()
					},
					{
						"type": "PAGE_NAVIGATE_URL",
						"shouldNotRecord": true,
						"payload": {
							"selectors": [

							],
							"meta": {
								"value": "about:blank"
							}
						},
						"status": "COMPLETED",
						"time": Date.now()
					},
					{
						"type": "PAGE_NAVIGATE_URL",
						"payload": {
							"selectors": [

							],
							"meta": {
								"value": validUrl
							}
						},
						"status": "COMPLETED",
						"time": Date.now()
					}]);
				} else {
					performNavigation(validUrl, store);
				}
				// Just in case onboarding overlay info is still visible
				dispatch(setShowShouldOnboardingOverlay(false));

				if (isOpen && currentStep === 0) {
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
	const LeftIconComponent = React.useMemo(() => (
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
		<div
			css={dropdownContainerStyle}
		>
			<MoreIcon
				css={dropdownMoreIconStyle}
			/>
		</div>
	</Dropdown>
	), [showMenu]);
	const RightIconComponent = React.useMemo(() => (
		<SelectBox
								selected={selectedDevice}
								callback={handleChangeDevice}
								className={"target-device-dropdown"}
								css={selectBoxStyle}
								values={recorderDevices}
							/>
	), [selectedDevice, recorderDevices]);
	return (
		<div css={containerStyle} {...props}>
			<Conditional showIf={isTestBeingVerified}>
				<div
					css={testBeingVerifiedContainerStyle}
				>
					<span
						css={drinkCupTextStyle}
					>
						Drink a cup of coffee meanwhile
					</span>
					<div
						css={verifyStatusIconStyle}
					>
						<LoadingIconV2
							css={loadingIconStyle}
						/>
						<span
							css={loadingTextStyle}
						>
							Crusher is verifying your test.{" "}
						</span>
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
				<MenuDropdown/>
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
				<div
					css={menuContainerStyle}
				>
					{showMenu}
				</div>
				<div
					css={inputContainerStyle}
				>
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
						<span
							css={inputErrorMessageStyle}
						>
							{urlInputError.message}
						</span>
					</Conditional>
				</div>
				<Conditional showIf={isRecorderInInitialState}>
					<Button className={"ml-24"} onClick={handleUrlReturn.bind(this)} bgColor="tertiary-outline" css={buttonStyle}>
						Start
					</Button>
				</Conditional>
				<Conditional showIf={!isRecorderInInitialState}>
					<div className={"ml-18 flex items-center"}>
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
					</div>

					<div className={"ml-auto mr-22 flex items-center"}>
						<SettingsIcon
							onClick={setShowSettingsModal.bind(this, true)}
							css={settingsIconStyle}
							className={"ml-12"}
						/>

						<SaveVerifyButton isTestVerificationComplete={isTestVerificationComplete} />
					</div>
				</Conditional>
			</Conditional>
			<SettingsModal isOpen={showSettingsModal} handleClose={handleCloseSettingsModal} />
		</div>
	);
};

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
	border-top-right-radius: 100rem;
    border-bottom-right-radius: 100rem;
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
	padding: 14rem;
	height: 30rem !important;
	border: none;
	background: none;
	border-left-width: 1rem;
	border-left-style: solid;
	border-left-color: rgba(255, 255, 255, 0.13);
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
margin: auto;
`;
const drinkCupTextStyle = css`
font-size: 14rem;
margin-left: 18rem;
`;
const testBeingVerifiedContainerStyle  = css`
display: flex;
						align-items: center;
						width: 100%;
						`
const hammerIconStyle = css`
width: 19rem;
:hover {
	opacity: 0.8;
}
`;
const inputContainerStyle = css`
position: relative;
display: flex;
flex-direction: column;
margin-left: 28rem;
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
:hover {
	opacity: 0.9;
}
`;

const containerStyle = css`
	display: flex;
	align-items: center;
	padding: 8rem;
	background-color: #111213;
	padding: 5rem;
	min-height: 60rem;
	position: relative;
	z-index: 999;
	padding-right: 24rem;
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
		width: 340rem;
		font-family: Gilroy;
		font-size: 14.6rem;
		/* border: 1px solid #9462ff; */
		outline-color: #9462ff;
		outline-width: 1px;
		box-sizing: border-box;
		border-radius: 8rem 0px 0px 8rem;
		color: rgba(255, 255, 255, 0.93);
		height: 100%;
		padding-left: 18rem;
		padding-right: 110rem;

		background: rgba(255, 255, 255, 0.02);
		border: 1px solid #292929;
		border-radius: 18px;
	}
	}
	svg {
		margin-left: auto;
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
	width: 93rem;
	height: 34rem;
`;

const saveButtonStyle = css`
	width: 128rem;
	height: 30rem;
	background: linear-gradient(0deg, #9462ff, #9462ff);
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: normal;
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
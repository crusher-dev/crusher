import React from "react";
import { css } from "@emotion/react";
import { Input } from "@dyson/components/atoms/input/Input";
import { SelectBox } from "@dyson/components/molecules/Select/Select";
import { Conditional } from "@dyson/components/layouts";
import { Button } from "@dyson/components/atoms/button/Button";
import { Text } from "@dyson/components/atoms/text/Text";
import { CrusherHammerIcon, DownIcon, LoadingIconV2, MoreIcon, NavigateBackIcon, NavigateRefreshIcon, SettingsIcon } from "../../icons";
import { BrowserButton } from "../buttons/browser.button";
import { useDispatch, batch, useSelector, useStore } from "react-redux";
import { setDevice, setSiteUrl } from "electron-app/src/store/actions/recorder";
import { devices } from "../../../devices";
import { getRecorderInfo, getRecorderState, isTestVerified } from "electron-app/src/store/selectors/recorder";
import {
	performNavigation,
	performReloadPage,
	performResetAppSession,
	performSetDevice,
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
import { useTour } from "@reactour/tour";
import { setShowShouldOnboardingOverlay } from "electron-app/src/store/actions/app";
import { sendSnackBarEvent } from "../toast";
import { Dropdown } from "@dyson/components/molecules/Dropdown";
import { TextBlock } from "@dyson/components/atoms/textBlock/TextBlock";

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
		saveTest();
		sendSnackBarEvent({ type: "success", message: "Saving test..." });
	};
	const handleUpdate = () => {
		setShowActionMenu(false);
		updateTest();
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

const SaveVerifyButton = ({ isTestVerificationComplete }) => {
	const intervalRef = React.useRef(null);
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
			performVerifyTest();
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
		saveTest();
	};

	const editTestInCloud = () => {
		if (isOpen) {
			setIsOpen(false);
		}

		updateTest();
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
	const [url, setUrl] = React.useState("" || null);
	const [selectedDevice, setSelectedDevice] = React.useState([recorderDevices[0].value]);
	const [showSettingsModal, setShowSettingsModal] = React.useState(false);
	const [urlInputError, setUrlInputError] = React.useState({ value: false, message: "" });
	const [showMenu, setShowMenu] = React.useState(false);

	const urlInputRef = React.useRef<HTMLInputElement>(null);
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const isTestVerificationComplete = useSelector(isTestVerified);

	const dispatch = useDispatch();
	const store = useStore();
	const { isOpen, currentStep, setCurrentStep } = useTour();

	React.useEffect(() => {
		if (recorderInfo.url !== url) {
			setUrl(recorderInfo.url);
		}
	}, [recorderInfo.url]);

	React.useEffect(() => {
		if (!url && urlInputRef.current) {
			urlInputRef.current.focus();
		}
	}, []);

	const handleUrlReturn = React.useCallback(() => {
		if (urlInputRef.current?.value) {
			const validUrl = addHttpToURLIfNotThere(urlInputRef.current?.value);
			if (!isValidHttpUrl(validUrl)) {
				setUrlInputError({ value: true, message: "Please enter a valid URL" });
				urlInputRef.current.blur();
				return;
			}
			setUrlInputError({ value: false, message: "" });
			batch(() => {
				if (selectedDevice[0] !== recorderInfo.device?.id) {
					// Setting the device will add webview in DOM tree
					// navigation will be run after 'webview-initialized' event
					dispatch(setDevice(selectedDevice[0]));
				}

				dispatch(setSiteUrl(validUrl.toString()));
				if (recorderInfo.url) {
					// Perform navigation if already recording
					performNavigation(validUrl.toString(), store);
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
	}, [selectedDevice, recorderInfo, currentStep, isOpen]);

	const handleChangeDevice = (selected) => {
		const device = recorderDevices.find((device) => device.value === selected[0])?.device;
		setSelectedDevice([selected[0]]);

		if (recorderInfo.url) {
			// Only perform and set if already recording
			resetTest(device);
		}
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

	return (
		<div css={containerStyle}>
			<Conditional showIf={isTestBeingVerified}>
				<div
					css={css`
						display: flex;
						align-items: center;
						width: 100%;
					`}
				>
					<span
						css={css`
							font-size: 14rem;
							margin-left: 18rem;
						`}
					>
						Drink a cup of coffee meanwhile
					</span>
					<div
						css={css`
							display: flex;
							font-weight: bold;
							align-items: center;
							font-size: 14rem;
							margin: auto;
						`}
					>
						<LoadingIconV2
							css={css`
								width: 24rem;
							`}
						/>
						<span
							css={css`
								margin-left: 12rem;
							`}
						>
							Our bot is verifying your test.{" "}
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

				<CrusherHammerIcon
					className={"ml-24"}
					css={css`
						width: 19rem;
					`}
				/>
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
					css={css`
						font-size: 14rem;
						color: #fff;
					`}
				>
					{showMenu}
				</div>
				<div
					css={css`
						position: relative;
						display: flex;
						flex-direction: column;
						margin-left: 28rem;
					`}
				>
					<Input
						placeholder="Enter URL to test"
						id={"target-site-input"}
						className={"target-site-input"}
						css={inputStyle}
						onReturn={handleUrlReturn}
						isError={urlInputError.value}
						initialValue={url}
						forwardRef={urlInputRef}
						leftIcon={
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
									css={css`
										height: 100%;
										display: flex;
										align-items: center;
										background: #0d1010;
										padding: 0rem 10rem;
										border-right: 0.35px solid rgba(255, 255, 255, 0.17);
									`}
								>
									<MoreIcon
										css={css`
											width: 18rem;
										`}
									/>
								</div>
							</Dropdown>
						}
						rightIcon={
							<SelectBox
								selected={selectedDevice}
								callback={handleChangeDevice}
								className={"target-device-dropdown"}
								css={css`
									.selectBox {
										:hover {
											border: none;
											border-left-width: 1rem;
											border-left-style: solid;
											border-left-color: #181c23;
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
										border-left-color: #181c23;
									}
									.selectBox__value {
										margin-right: 10rem;
										font-size: 13rem;
									}
									width: 104rem;
								`}
								values={recorderDevices}
							/>
						}
					/>
					<Conditional showIf={urlInputError.value}>
						<span
							css={css`
								position: absolute;
								bottom: -14rem;
								font-size: 10.5rem;
								color: #ff4583;
							`}
						>
							{urlInputError.message}
						</span>
					</Conditional>
				</div>
				<Conditional showIf={isRecorderInInitialState}>
					<Button className={"ml-24"} onClick={handleUrlReturn} bgColor="tertiary-outline" css={buttonStyle}>
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
							{![TRecorderState.PERFORMING_ACTIONS, TRecorderState.PERFORMING_RECORDER_ACTIONS].includes(recorderState.type) ? "Rec." : "Waiting"}
						</Text>
					</div>

					<div className={"ml-auto flex items-center"}>
						<SettingsIcon
							onClick={setShowSettingsModal.bind(this, true)}
							css={css`
								height: 14rem;
								:hover {
									opacity: 0.9;
								}
							`}
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

const containerStyle = css`
	display: flex;
	align-items: center;
	padding: 8rem;
	background-color: #111213;
	padding: 5rem;
	min-height: 60rem;
	position: relative;
	z-index: 99999999;
`;
const inputStyle = css`
	height: 34rem;
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
		padding-left: 50rem;
		padding-right: 110rem;
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

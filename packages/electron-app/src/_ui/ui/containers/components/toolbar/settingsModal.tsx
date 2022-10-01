import React from "react";
import { ModalTopBar } from "../modals/topBar";
import { Modal } from "@dyson/components/molecules/Modal";
import { css } from "@emotion/react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { focusOnWindow, saveAndGetUserInfo } from "electron-app/src/_ui/commands/perform";
import Switch from "@dyson/components/atoms/toggle/switch";
import { getAppSettings, getUserAccountInfo } from "electron-app/src/store/selectors/app";
import { setSettngs } from "electron-app/src/store/actions/app";
import { iReduxState } from "electron-app/src/store/reducers";
import { sendSnackBarEvent } from "../toast";
import { Conditional } from "@dyson/components/layouts";
import { LoadingIconV2 } from "../../../../constants/old_icons";
import { shell } from "electron";
import { waitForUserLogin } from "electron-app/src/utils";
import { resolveToFrontEndPath } from "@shared/utils/url";
import { SettingsManager } from "electron-app/src/lib/settingsManager";
import { newButtonStyle } from "electron-app/src/_ui/constants/style";
import ConfirmDialog from "@dyson/components/sharedComponets/ConfirmModal";

interface iStartupModalProps {
	isOpen: boolean;
	handleClose: () => void;
}

enum ConnectToCloudStatusEnum {
	NOT_CONNECTED = "NOT_CONNECTED",
	WAITING = "WAITING",
	CONNECTED = "CONNECTED",
}

const SettingsModalContent = ({ className, ...props }: iStartupModalProps & { className?: string }) => {
	const appSettings = useSelector(getAppSettings);
	const userAccountInfo = useSelector(getUserAccountInfo);

	const [backendEndPoint, setBackendEndPoint] = React.useState(appSettings.backendEndPoint || "");
	const [frontendEndPoint, setFrontendEndPoint] = React.useState(appSettings.frontendEndPoint || "");
	const [autoDetectActions, setAutoDetctActions] = React.useState(appSettings.autoDetectActions || false);
	const [enableMouseTracker, setEnableMouseTracker] = React.useState(appSettings.enableMouseTracker || false);
	const [connectToCloudStatus, setConnectToCloudStatus] = React.useState(
		userAccountInfo ? ConnectToCloudStatusEnum.CONNECTED : ConnectToCloudStatusEnum.NOT_CONNECTED,
	);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (userAccountInfo) {
			setConnectToCloudStatus(ConnectToCloudStatusEnum.CONNECTED);
		} else {
			setConnectToCloudStatus(ConnectToCloudStatusEnum.NOT_CONNECTED);
		}
	}, [userAccountInfo]);

	const handleBackendEndPointChange = (event: any) => {
		setBackendEndPoint(event.target.value);
	};

	const handleFrontEndPointChange = (event: any) => {
		setFrontendEndPoint(event.target.value);
	};

	const handleEnableMouseTrackerCallback = (toggleValue) => {
		setEnableMouseTracker(toggleValue);
	};

	const saveAction = () => {
		const settings: iReduxState["app"]["settings"] = {
			backendEndPoint,
			frontendEndPoint,
			autoDetectActions,
			enableMouseTracker,
		};
		localStorage.setItem("app.settings", JSON.stringify(settings));
		SettingsManager.saveSettings(settings);
		dispatch(setSettngs(settings));

		sendSnackBarEvent({ type: "success", message: "Settings saved" });
		props.handleClose();
	};

	const connectToCloud = React.useCallback(async () => {
		setConnectToCloudStatus(ConnectToCloudStatusEnum.WAITING);
		const { loginKey } = await waitForUserLogin((loginToken: string) => {
			saveAndGetUserInfo(loginToken).then((info) => {
				focusOnWindow();
				sendSnackBarEvent({ type: "success", message: `Login successful! Welcome, ${info.name}` });
			});
		}, backendEndPoint);
		await shell.openExternal(resolveToFrontEndPath("?lK=" + loginKey, frontendEndPoint));
	}, [backendEndPoint, frontendEndPoint]);

	const handleConnectToCloud = React.useCallback(() => {
		if (connectToCloudStatus === ConnectToCloudStatusEnum.NOT_CONNECTED) {
			connectToCloud();
		} else if (connectToCloudStatus === ConnectToCloudStatusEnum.CONNECTED) {
			sendSnackBarEvent({ type: "info", message: `Already Connected to startcloud! Hello, ${userAccountInfo.name}` });
		} else {
			sendSnackBarEvent({ type: "error", message: "Waiting for the login process to complete" });
		}
	}, [userAccountInfo, connectToCloudStatus]);

	const connectWordMap = {
		[ConnectToCloudStatusEnum.CONNECTED]: "Connected",
		[ConnectToCloudStatusEnum.WAITING]: "Connecting",
		[ConnectToCloudStatusEnum.NOT_CONNECTED]: "Connect",
	};

	return (
		<div css={formContainerStyle} className={String(className)}>
			<div
				css={css`
					font-size: 15rem;
					font-weight: 600;
					color: #fff;
					font-family: Cera Pro;
				`}
			>
				General
			</div>
			<ConfirmDialog action="close" />
			<hr
				css={css`
					margin-top: 8rem;
					border-color: rgb(255, 255, 255, 0.1);
					height: 0.1rem;
				`}
			/>
			<div
				css={css`
					margin-top: 16rem;
				`}
			>
				<div css={inputContainerStyle}>
					<div
						css={css`
							font-size: 13rem;
							color: rgb(255, 255, 255, 0.7);
							font-weight: 600;
						`}
					>
						Backend endpoint
					</div>
					<Input
						css={inputStyle}
						placeholder={"Enter backend endpoint"}
						pattern="[0-9]*"
						size={"medium"}
						initialValue={backendEndPoint}
						autoFocus={true}
						onReturn={saveAction}
						onChange={handleBackendEndPointChange}
					/>
				</div>
				<div
					css={[
						inputContainerStyle,
						css`
							margin-top: 18rem;
						`,
					]}
				>
					<div
						css={css`
							font-size: 13rem;
							color: rgb(255, 255, 255, 0.7);
							font-weight: 600;
						`}
					>
						Frontend endpoint
					</div>
					<Input
						css={inputStyle}
						placeholder={"Enter frontend endpoint"}
						pattern="[0-9]*"
						size={"medium"}
						initialValue={frontendEndPoint}
						autoFocus={true}
						onReturn={saveAction}
						onChange={handleFrontEndPointChange}
					/>
				</div>
			</div>
			<div
				css={css`
					font-size: 15rem;
					font-weight: 600;
					color: #fff;
					margin-top: 30rem;
					font-family: Cera Pro;
				`}
			>
				Recorder
			</div>
			<hr
				css={css`
					margin-top: 8rem;
					border-color: rgb(255, 255, 255, 0.1);
					height: 0.1rem;
				`}
			/>
			<div
				css={css`
					margin-top: 16rem;
				`}
			>
				<div css={inputContainerStyle} className="flex justify-between">
					<div
						css={css`
							font-size: 13rem;
							color: rgb(255, 255, 255, 0.7);
							font-weight: 600;
						`}
					>
						Auto-detect actions
					</div>

					<Switch checked={autoDetectActions} onCheckedChange={setAutoDetctActions} size={"small"} />
				</div>
				<div
					className="flex justify-between"
					css={[
						inputContainerStyle,
						css`
							margin-top: 18rem;
						`,
					]}
				>
					<div
						css={css`
							font-size: 13rem;
							color: rgb(255, 255, 255, 0.7);
							font-weight: 600;
						`}
					>
						Enable mouse tracker
					</div>

					<Switch checked={enableMouseTracker} onCheckedChange={handleEnableMouseTrackerCallback} size={"small"} />
				</div>
			</div>
			<div css={submitFormContainerStyle} className={"submit-action-button"}>
				<div
					onClick={handleConnectToCloud}
					css={css`
						display: flex;
						align-items: center;
						color: #fff;
						font-size: 13rem;
						:hover {
							opacity: 0.9;
						}
					`}
				>
					<span>{connectWordMap[connectToCloudStatus]} to cloud</span>
					<Conditional showIf={connectToCloudStatus === ConnectToCloudStatusEnum.WAITING}>
						<LoadingIconV2
							css={css`
								height: 20rem;
								margin-left: 6rem;
							`}
						/>
					</Conditional>
					<Conditional showIf={connectToCloudStatus === ConnectToCloudStatusEnum.CONNECTED}>
						<img src={"./static/assets/icons/correct.svg"} style={{ marginLeft: "6rem", height: "14rem", marginTop: "-2rem" }} />
					</Conditional>
				</div>
				<Button onClick={saveAction} css={[buttonStyle, newButtonStyle]}>
					Save
				</Button>
			</div>
		</div>
	);
};

const SettingsModal = (props: iStartupModalProps) => {
	const { isOpen } = props;
	if (!isOpen) return null;

	return (
		<Modal modalStyle={modalStyle} onOutsideClick={props.handleClose}>
			<ModalTopBar title={"Settings"} desc={"Configure app settings for more customization"} closeModal={props.handleClose} />
			<SettingsModalContent {...props} />
		</Modal>
	);
};

const formContainerStyle = css`
	margin-top: 3.375rem;
	padding: 26rem 34rem;
`;
const submitFormContainerStyle = css`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: 100%;
	margin-top: 36rem;
`;
const modalStyle = css`
	width: 700rem;
	position: fixed;
	top: 50%;
	left: 60%;
	transform: translate(-50%, -20%);
	display: flex;
	flex-direction: column;
	padding: 0rem !important;
	min-height: 214rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), #111213;
	border: 1px solid #131516;
	box-shadow: 0px 4px 50px 2px rgb(255 255 255 / 1%);
`;

const buttonStyle = css`
	width: 93rem;

	margin-left: 30rem;
`;
const inputStyle = css`
	background: #1a1a1c;
	border-radius: 6rem;

	font-size: 14rem;
	min-width: 358rem;
	color: #fff;
	outline: none;
	margin-left: auto;
`;
const inputContainerStyle = css`
	display: flex;
	align-items: center;
	color: #fff;
`;

export { SettingsModal, SettingsModalContent };

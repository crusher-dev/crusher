import React from "react";
import { ModalTopBar } from "../../modals/topBar";
import { Modal } from "@dyson/components/molecules/Modal";
import { css } from "@emotion/react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { performRunAfterTest } from "electron-app/src/ui/commands/perform";
import { Toggle } from "@dyson/components/atoms/toggle/toggle";
import { getAppSettings } from "electron-app/src/store/selectors/app";
import { setSettngs } from "electron-app/src/store/actions/app";
import { iReduxState } from "electron-app/src/store/reducers";
import { sendSnackBarEvent } from "../../toast";
import { AddIcon, DownIcon, UpIcon } from "electron-app/src/ui/icons";
import { Conditional } from "@dyson/components/layouts";

interface iStartupModalProps {
	isOpen: boolean;
	handleClose: () => void;
}

const TemplatesModal = (props: iStartupModalProps) => {
	const { isOpen } = props;
	const appSettings = useSelector(getAppSettings);
	const [showRequirements, setShowRequirements] = React.useState(false);

	const [templateName, setTemplateName] = React.useState("");
	const [frontendEndPoint, setFrontendEndPoint] = React.useState(appSettings.frontendEndPoint || "");
	const [autoDetectActions, setAutoDetctActions] = React.useState(appSettings.autoDetectActions || false);
	const [enableMouseTracker, setEnableMouseTracker] = React.useState(appSettings.enableMouseTracker || false);

	const dispatch = useDispatch();

	const handleBackendEndPointChange = (event: any) => {
		setTemplateName(event.target.value);
	};

	const handleFrontEndPointChange = (event: any) => {
		setFrontendEndPoint(event.target.value);
	};

	const handleEnableMouseTrackerCallback = (toggleValue) => {
		setEnableMouseTracker(toggleValue);
	};

	const handleAutoDetectActionsCallback = (toggleValue) => {
		setAutoDetctActions(toggleValue);
	};

	const saveAction = async () => {
		const settings: iReduxState["app"]["settings"] = {
			backendEndPoint: templateName,
			frontendEndPoint,
			autoDetectActions,
			enableMouseTracker,
		};
		localStorage.setItem("app.settings", JSON.stringify(settings));
		dispatch(setSettngs(settings));

		sendSnackBarEvent({ type: "success", message: "Settings saved" });
		props.handleClose();
	};

	if (!isOpen) return null;

	return (
		<Modal modalStyle={modalStyle} onOutsideClick={props.handleClose}>
			<ModalTopBar title={"Templates"} desc={"Groups series of steps into single shareable step"} closeModal={props.handleClose} />
			<div
				css={[
					css`
						height: 500rem;
						overflow-y: overlay;
					`,
					scrollBarStyle,
				]}
			>
				<div css={formContainerStyle}>
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
								Template name
							</div>
							<Input
								css={inputStyle}
								placeholder={"Enter template name"}
								pattern="[0-9]*"
								size={"medium"}
								initialValue={templateName}
								autoFocus={true}
								onReturn={saveAction}
								onChange={handleBackendEndPointChange}
							/>
						</div>
						<div
							css={[
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
								Description
							</div>
							<textarea
								placeholder={"Enter description of template"}
								css={css`
									width: 100%;
									font-family: Cera Pro;
									height: 240rem;
									border-radius: 4rem;
									margin-top: 12rem;
									font-size: 14rem;
									color: #000;
									padding: 8rem;
								`}
							></textarea>
						</div>
					</div>

					<div
						onClick={setShowRequirements.bind(this, !showRequirements)}
						css={css`
							font-size: 15rem;
							font-weight: 600;
							color: #fff;
							margin-top: 30rem;
							font-family: Cera Pro;
							display: flex;
							:hover {
								opacity: 0.7;
							}
						`}
					>
						<span>Requirements</span>
						<div
							css={css`
								margin-left: auto;
								font-weight: 500;
							`}
						>
							<Conditional showIf={showRequirements}>
								<UpIcon
									css={css`
										margin-right: 4rem;
									`}
								/>
							</Conditional>
							<Conditional showIf={!showRequirements}>
								<DownIcon
									css={css`
										margin-right: 4rem;
									`}
								/>
							</Conditional>
						</div>
					</div>
					<hr
						css={css`
							margin-top: 8rem;
							border-color: rgb(255, 255, 255, 0.1);
							height: 0.1rem;
						`}
					/>
					<Conditional showIf={showRequirements}>
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
									Auto-detect actions
								</div>

								<Toggle
									isOn={autoDetectActions}
									callback={handleAutoDetectActionsCallback}
									css={css`
										margin-left: auto;
									`}
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
									Enable mouse tracker
								</div>

								<Toggle
									isOn={enableMouseTracker}
									callback={handleEnableMouseTrackerCallback}
									css={css`
										margin-left: auto;
									`}
								/>
							</div>
						</div>
					</Conditional>

					<div css={submitFormContainerStyle}>
						<Button onClick={saveAction} css={buttonStyle}>
							Save
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

const formContainerStyle = css`
	margin-top: 3.375rem;
	padding: 26rem 34rem;
	padding-top: 0rem;
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
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -20%);
	display: flex;
	flex-direction: column;
	padding: 0rem !important;
	min-height: 214rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), #111213;
	border: 1px solid #131516;
	box-shadow: 0px 4px 50px 2px rgb(255 255 255 / 1%);
`;

const scrollBarStyle = css`
	::-webkit-scrollbar {
		display: none;
	}
`;

const buttonStyle = css`
	font-size: 13rem;
	border: 1px solid rgba(255, 255, 255, 0.23);
	box-sizing: border-box;
	border-radius: 4rem;
	width: 93rem;
	height: 30rem;
	margin-left: 30rem;
`;
const inputStyle = css`
	background: #1a1a1c;
	border-radius: 6rem;
	border: 1rem solid #43434f;
	font-family: Gilroy;
	font-size: 14rem;
	min-width: 358rem;
	color: #fff;
	outline: nonet;
	margin-left: auto;
`;
const inputContainerStyle = css`
	display: flex;
	align-items: center;
	color: #fff;
`;

export { TemplatesModal };

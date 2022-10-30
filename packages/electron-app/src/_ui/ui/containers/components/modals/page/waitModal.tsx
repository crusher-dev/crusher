import { Button } from "@dyson/components/atoms/button/Button";
import { Input } from "@dyson/components/atoms/input/Input";
import { Modal } from "@dyson/components/molecules/Modal";
import { css } from "@emotion/react";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { ActionStatusEnum } from "@shared/lib/runnerLog/interface";
import { iAction } from "@shared/types/action";
import { recordStep, updateRecordedStep } from "electron-app/src/store/actions/recorder";
import { getSavedSteps } from "electron-app/src/store/selectors/recorder";
import React from "react";
import { useDispatch, useStore } from "react-redux";
import { sendSnackBarEvent } from "../../toast";
import { ModalTopBar } from "../topBar";

interface iStartupModalProps {
	isOpen: boolean;
	stepIndex?: number | null;
	stepAction?: iAction | null;
	handleClose: () => void;
}

const WaitModal = (props: iStartupModalProps) => {
	const { isOpen } = props;
	const [waitInterval, setWaitInterval] = React.useState("");
	const dispatch = useDispatch();
	const store = useStore();

	React.useEffect(() => {
		if (props.stepIndex) {
			const recordedSteps = getSavedSteps(store.getState());
			if (recordedSteps[props.stepIndex].payload.timeout) {
				setWaitInterval(recordedSteps[props.stepIndex].payload.timeout.toString());
			}
		}
	}, [props.stepIndex]);

	const handleIntervalChange = (event) => {
		setWaitInterval(event.target.value);
	};

	const handleSubmit = React.useCallback(() => {
		if (!waitInterval.trim().length) {
			alert("Please enter a valid interval");
			return;
		}

		if (props.stepIndex) {
			const recordedSteps = getSavedSteps(store.getState());
			const recordedStep = recordedSteps[props.stepIndex];

			dispatch(
				updateRecordedStep(
					{
						...recordedStep,
						payload: {
							...recordedStep.payload,
							timeout: parseInt(waitInterval, 10),
						},
					} as any,
					props.stepIndex,
				),
			);
		} else {
			dispatch(
				recordStep(
					{
						type: ActionsInTestEnum.WAIT,
						payload: {
							timeout: parseInt(waitInterval, 10),
							meta: {},
						},
					},
					ActionStatusEnum.COMPLETED,
				),
			);
			sendSnackBarEvent({ type: "success", message: "Wait action updated" });
		}

		props.handleClose();
	}, [props.stepIndex, waitInterval]);

	if (!isOpen) return null;

	return (
		<Modal id="current-modal" modalStyle={modalStyle} onOutsideClick={props.handleClose}>
			<ModalTopBar title={"Sleep"} desc={"sleeps for few seconds."} closeModal={props.handleClose} />
			<div
				className="flex flex-col"
				style={{ marginTop: 40 }}
				css={css`
					padding: 28rem ;
				`}
			>
				<div
					className="flex"
					css={css`
						display: flex;
					`}
				>
					<Input
						css={inputStyle}
						placeholder={"Add seconds to wait in seconds"}
						pattern="[0-9]*"
						size={"medium"}
						initialValue={waitInterval}
						onChange={handleIntervalChange}
					/>

					<Button onClick={handleSubmit} bgColor="tertiary-outline" css={buttonStyle}>
						{props.stepIndex ? "Update" : "Save"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

const buttonStyle = css`
	font-size: 13rem;
	border: 1px solid rgba(255, 255, 255, 0.23);
	box-sizing: border-box;
	border-radius: 4rem;
	width: 93rem;
	height: 36rem !important;
	margin-left: 12rem;
`;

const modalStyle = css`
	width: 400rem;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -20%);
	display: flex;
	flex-direction: column;
	padding: 0rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), #111213;
`;

const inputStyle = css`
	min-width: 320rem;

`;

export { WaitModal };

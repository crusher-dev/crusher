import React from "react";
import { ModalTopBar } from "../../../modals/topBar";
import { Modal } from "@dyson/components/molecules/Modal";
import { css } from "@emotion/react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";
import { useDispatch } from "react-redux";
import { performRunAfterTest } from "electron-app/src/ui/commands/perform";

interface iStartupModalProps {
	isOpen: boolean;
    handleClose: () => void;
}

const RunAfterTestModal = (props: iStartupModalProps) => {
	const { isOpen } = props;
	const [testId, setTestId] = React.useState("");

    const dispatch = useDispatch();

	const handleTestIdChange = (event: any) => {
		setTestId(event.target.value);
	};

	const saveAction = async () => {
		if (testId && testId !== "") {
			performRunAfterTest(testId);
			props.handleClose();
		}
	};

	if(!isOpen) return null;

	return (
		<Modal modalStyle={modalStyle} onOutsideClick={props.handleClose}>
			<ModalTopBar title={"Run after test"} desc={"Runs test in the same browser context as specified"} closeModal={props.handleClose} />
			<div css={formContainerStyle} css={css`display:flex; padding: 26rem 34rem;`}>
				<div style={inputContainerStyle}>
					<Input
						css={inputStyle}
						placeholder={"Enter test id"}
						pattern="[0-9]*"
						size={"medium"}
						initialValue={testId}
						autoFocus={true}
						onReturn={saveAction}
						onChange={handleTestIdChange}
					/>
				</div>
				<div css={submitFormContainerStyle}>
					<Button onClick={saveAction} css={buttonStyle}>Save</Button>
				</div>
			</div>
		</Modal>
	);
};

const formContainerStyle = css`
    margin-top: 3.375rem;
`;
const submitFormContainerStyle = css`
    display: flex;
    width: 100%;
    margin-top: 2.25rem;
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
`;

const buttonStyle = css`
	font-size: 13rem;
	border: 1px solid rgba(255, 255, 255, 0.23);
	box-sizing: border-box;
	border-radius: 4rem;
	width: 93rem;
	height: 34rem;
	margin-left: 20rem;
`;
const inputStyle = css`
	background: #1A1A1C;
	border-radius: 6rem;
	border: 1rem solid #43434F;
	font-family: Gilroy;
	font-size: 14rem;
	min-width: 358rem;
	color: #fff;
	outline: nonet;
`;
const inputContainerStyle = {
	display: "flex",
	fontFamily: "DM Sans",
	alignItems: "center",
	color: "#fff",
};

export { RunAfterTestModal };

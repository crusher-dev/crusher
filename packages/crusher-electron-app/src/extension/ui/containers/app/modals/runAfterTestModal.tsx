import React, { useState } from "react";
import ReactModal from "react-modal";
import { FONT_WEIGHT, POSITION } from "../../../../interfaces/css";
import { COLOR_CONSTANTS } from "../../../colorConstants";
import { pxToRemValue } from "../../../../utils/helpers";
import { ModalTopBar } from "./index";
import { AdvancedURL } from "../../../../utils/url";
import { Modal } from "@dyson/components/molecules/Modal";
import { updateActionsModalState } from "crusher-electron-app/src/extension/redux/actions/recorder";
import { getStore } from "crusher-electron-app/src/extension/redux/store";
import { css } from "@emotion/react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";

interface iStartupModalProps {
	isOpen: boolean;
}

const RunAfterTestModal = (props: iStartupModalProps) => {
	const { isOpen } = props;
	const [testId, setTestId] = useState("");

	const handleTestIdChange = (event: any) => {
		setTestId(event.target.value);
	};

	const handleClose = () => {
		const store = getStore();
		store.dispatch(updateActionsModalState(null));
	}

	const saveAction = async () => {
		if (testId && testId !== "") {
			if (!(window as any).electron) {
				handleClose();
				throw new Error("Cannot find exposed electron API");
			}

			await (window as any).electron.runAfterThisTest(testId);
			handleClose();
		}
	};



	if(!isOpen) return null;
	
	return (
		<Modal modalStyle={modalStyle} onOutsideClick={handleClose}>
			<ModalTopBar title={"Run after test"} desc={"Runs test in the same browser context as specified"} closeModal={handleClose} />
			<div style={formContainerStyle} css={css`display:flex; padding: 26rem 34rem;`}>
				<div style={inputContainerStyle}>
					<Input
						css={inputStyle}
						placeholder={"Enter test id"}
						pattern="[0-9]*"
						initialValue={testId}
						autoFocus={true}
						onReturn={saveAction}
						onChange={handleTestIdChange}
					/>
				</div>
				<div style={submitFormContainerStyle}>
					<Button onClick={saveAction} CSS={buttonStyle}>Save</Button>
				</div>
			</div>
		</Modal>
	);
};

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
const formContainerStyle = {
	marginTop: pxToRemValue(54),
};
const submitFormContainerStyle = {
	width: "100%",
	display: "flex",
	marginTop: pxToRemValue(36),
};
const inputStyle = css`
	background: #1A1A1C!important;
	border-radius: 6rem!important;
	border: 1rem solid #43434F!important;
	padding: 6rem 18rem!important;
	font-family: Gilroy!important;
	font-size: 14rem!important;
	min-width: 358rem!important;
	color: #fff!important;
	outline: none!important;
	height: 38rem !important;
`;
const inputContainerStyle = {
	display: "flex",
	fontFamily: "DM Sans",
	alignItems: "center",
	color: "#fff",
};
const customModalStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		maxHeight: "33.75rem",
		margin: 0,
		borderRadius: 8,
		borderWidth: 0,
		width: 700,
		overflow: "auto",
		padding: "36px 40px",
		background: "rgb(17,18,19)",
		zIndex: 100000,
	},
	overlay: {
		background: "rgba(0,0,0,0.5)",
		position: POSITION.ABSOLUTE,
		left: 0,
		top: 0,
		height: "100%",
		width: "100%",
		zIndex: 100000,
	},
};
export { RunAfterTestModal };

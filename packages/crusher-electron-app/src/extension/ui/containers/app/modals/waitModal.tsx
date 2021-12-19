import React, { useCallback, useState } from "react";
import ReactModal from "react-modal";
import { FONT_WEIGHT } from "../../../../interfaces/css";
import { addHttpToURLIfNotThere } from "@shared/utils/url";
import { COLOR_CONSTANTS } from "../../../colorConstants";
import { validURL } from "../../../../utils/helpers";
import { ModalTopBar } from ".";
import { recordAction } from "crusher-electron-app/src/extension/redux/actions/actions";
import { getStore } from "crusher-electron-app/src/extension/redux/store";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { updateActionsModalState } from "crusher-electron-app/src/extension/redux/actions/recorder";
import { Modal } from "@dyson/components/molecules/Modal";
import { css } from "@emotion/react";
import { Input } from "@dyson/components/atoms/input/Input";
import { Button } from "@dyson/components/atoms/button/Button";

interface iStartupModalProps {
	isOpen: boolean;
}

const WaitModal = (props: iStartupModalProps) => {
	const { isOpen } = props;
	const [interval, setInterval] = useState("");

	const handleIntervalChange = (event) => {
		setInterval(event.target.value);
	};

	const handleClose = () => {
		const store = getStore();
		store.dispatch(updateActionsModalState(null));
	};

	const handleSubmit = useCallback(() => {
		const store = getStore();
		if (!interval.trim().length) {
			alert("Please enter a valid interval");
			return;
		}

		store.dispatch(
			recordAction({
				type: ActionsInTestEnum.WAIT,
				payload: {
					timeout: parseInt(interval),
					meta: {},
				},
				url: "",
			}),
		);
		handleClose();
	}, [interval]);

	if(!isOpen) return null;

	return (
		<Modal modalStyle={modalStyle}>
			<ModalTopBar title={"Wait For Seconds"} desc={"These are used to wait/sleep for the specified interval"} closeModal={handleClose} />
			<div className="flex flex-col" style={{ marginTop: 40 }} css={css`padding: 26rem 34rem;`}>
				<div className="flex" css={css`display: flex`}>
					<Input
						css={inputStyle}
						placeholder={"Add seconds to wait in seconds"}
						pattern="[0-9]*"
						initialValue={interval}
						onChange={handleIntervalChange}
					/>

					<Button onClick={handleSubmit} bgColor="tertiary-outline" CSS={buttonStyle}>
						{"Save"}
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
	height: 34rem;
`;

const modalStyle = css`
	width: 800rem;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -20%);
	display: flex;
	flex-direction: column;
	padding: 0rem;
	background: linear-gradient(0deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.42)), #111213;
`;

const buttonStyle = {
	backgroundColor: COLOR_CONSTANTS.BUTTON_BLUE,
	padding: 7,
	minWidth: 150,
	borderRadius: 4,
	color: "#fff",
	fontWeight: FONT_WEIGHT.BOLD,
	fontSize: 15,
	marginLeft: "auto",
	border: 0,
	cursor: "pointer",
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

const customModalStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		maxHeight: "300rem",
		margin: 0,
		borderRadius: 8,
		borderWidth: 0,
		width: 760,
		overflow: "auto",
		padding: "36px 40px",
		background: "rgb(17,18,19)",
		zIndex: 100000,
	},
	overlay: {
		background: "rgb(17,18,19)",
		width: "100%",
		height: "100%",
		zIndex: 100000,
	},
};

const topBarStyle = {
	display: "flex",
	justifyContent: "space-between",
	marginBottom: "1rem",
	background: "rgb(17,18,19)",
};
const topLeftSectionStyle = {
	display: "flex",
};
const headingContainerStyle = {
	marginLeft: 16,
};
const headingStyle = {
	fontStyle: "normal",
	fontWeight: 800,
	fontSize: "22",
	marginBottom: 0,
	color: "#FFFFFF",
};
const subHeadingStyle = {
	fontStyle: "normal",
	fontSize: "0.8rem",
	color: "#FFFFFF",
};
const topBarBrowserIcon = {
	marginRight: 20,
};
const closeButtonStyle = {
	cursor: "pointer",
};

export { WaitModal };

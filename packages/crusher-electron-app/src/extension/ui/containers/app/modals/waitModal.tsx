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

	return (
		<ReactModal isOpen={isOpen} contentLabel="Wait Modal" style={customModalStyles} overlayClassName="overlay">
			<ModalTopBar title={"Wait For Seconds"} desc={"These are used to wait/sleep for the specified interval"} closeModal={handleClose} />
			<div className="flex flex-col" style={{ marginTop: 40 }}>
				<div className="flex">
					<input
						style={inputStyle}
						autoFocus={true}
						placeholder={"Add seconds to wait in seconds"}
						pattern="[0-9]*"
						value={interval}
						onChange={handleIntervalChange}
					/>
					<button style={buttonStyle} onClick={handleSubmit}>
						{"Save"}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

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
const inputStyle = {
	background: "#1A1A1C",
	borderRadius: 6,
	border: "1px solid #43434F",
	padding: "9px 20px",
	fontFamily: "DM Sans",
	fontSize: 15,
	minWidth: 358,
	color: "#fff",
	outline: "none",
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

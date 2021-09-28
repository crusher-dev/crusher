import React, { useState } from "react";
import ReactModal from "react-modal";
import { FONT_WEIGHT } from "../../../../interfaces/css";
import { addHttpToURLIfNotThere } from "@shared/utils/url";
import { COLOR_CONSTANTS } from "../../../colorConstants";
import { validURL } from "../../../../utils/helpers";

interface iStartupModalProps {
	isOpen: boolean;
}

const StartupModal = (props: iStartupModalProps) => {
	const { isOpen } = props;
	const [targetURL, setTargetURL] = useState(null);

	const handleTargetSiteChange = (event: any) => {
		setTargetURL(event.target.value);
	};

	const startRecording = () => {
		if (!validURL(targetURL)) {
			alert("URL is not valid");
			return;
		}
	};

	const handleKeyPress = (e: any) => {
		if (e.key === "Enter") {
			startRecording();
		}
	};

	return (
		<ReactModal isOpen={isOpen} contentLabel="Startup Modal" style={customModalStyles} overlayClassName="overlay">
			<div className="flex flex-col">
				<div className="flex">
					<input
						style={inputStyle}
						autoFocus={true}
						placeholder={"Enter URL to test"}
						value={targetURL}
						onKeyPress={handleKeyPress}
						onChange={handleTargetSiteChange}
					/>
					<button style={buttonStyle} onClick={startRecording}>
						{"Record test"}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

const buttonStyle = {
	backgroundColor: COLOR_CONSTANTS.BUTTON_BLUE,
	padding: 9,
	minWidth: 170,
	borderRadius: 4,
	color: "#fff",
	fontWeight: FONT_WEIGHT.BOLD,
	fontSize: 16,
	marginLeft: 14,
	border: 0,
	cursor: "pointer",
};
const inputStyle = {
	background: "#1A1A1C",
	borderRadius: 6,
	border: "1px solid #43434F",
	padding: "11px 20px",
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
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	overlay: {
		background: "rgb(17,18,19)",
		width: "100%",
		height: "100%",
		zIndex: 100000,
	},
};
export { StartupModal };

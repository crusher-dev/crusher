import React from "react";
import { FLEX_DIRECTION, FONT_WEIGHT, TEXT_ALIGN } from "../../../../interfaces/css";

interface iHowToUseVideoModalProps {
	onClose: any;
}

const HowToUseVideoModal = (props: iHowToUseVideoModalProps) => {
	const { onClose } = props;

	const handleNext = () => {
		localStorage.setItem("lastVisit", Date.now().toString());
		onClose();
	};

	return (
		<div style={containerStyle}>
			<div style={titleStyle}>How to use crusher?</div>
			<video style={videoStyle} src={"https://app.crusher.dev/assets/video/onboarding.mp4"} controls autoPlay={true}></video>
			<div style={infoTextContainerStyle}>
				<div>{"We're pushing a lot of boundaries."}</div>
				<div>Although some things might not work as expected.</div>
				<div style={thanksStyle}>Thanks for being early adopter.</div>
			</div>
			<div style={buttonStyle} onClick={handleNext}>
				Next
			</div>
		</div>
	);
};

const containerStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.COLUMN,
	alignItems: "center",
	justifyContent: "center",
	fontFamily: "DM Sans",
	fontStyle: "normal",
	color: "#fff",
};

const titleStyle = {
	fontWeight: FONT_WEIGHT.BOLD,
	fontSize: "22px",
};

const videoStyle = {
	width: "100%",
	height: "24.75rem",
	borderRadius: "0.6rem",
	margin: "0 auto",
	marginTop: "1.5rem",
};

const infoTextContainerStyle = {
	fontSize: 14,
	marginTop: "1.7rem",
	textAlign: TEXT_ALIGN.CENTER,
};

const thanksStyle = {
	color: "#f542ca",
};

const buttonStyle = {
	marginTop: "3.5rem",
	background: "#FF4BA2",
	padding: "0.4rem",
	fontWeight: FONT_WEIGHT.BOLD,
	fontSize: 18,
	textAlign: TEXT_ALIGN.CENTER,
	borderRadius: "4px",
	width: "8.75rem",
	cursor: "pointer",
};

export { HowToUseVideoModal };

import React, { RefObject } from "react";
import { FLEX_DIRECTION, FONT_WEIGHT, TEXT_ALIGN } from "../../../interfaces/css";
import { turnOffInspectModeInFrame } from "../../../messageListener";

interface iSelectElementPlaceholderProps {
	deviceIframeRef: RefObject<HTMLWebViewElement>;
}
const SelectElementPlaceholder = (props: iSelectElementPlaceholderProps) => {
	const handleGoBackClick = () => {
		turnOffInspectModeInFrame(props.deviceIframeRef);
	};

	return (
		<div>
			<div style={contentStyle}>
				<img src={chrome.runtime.getURL("/assets/click_on_page.png")} />
				<div style={headingStyle}>Select an element</div>
				<div style={tipStyle}>
					To perform action, select element in
					<br />
					window
				</div>
			</div>
			<div style={goBackStyle} onClick={handleGoBackClick}>
				{"< Go back"}
			</div>
		</div>
	);
};

const contentStyle = {
	display: "flex",
	flexDirection: FLEX_DIRECTION.COLUMN,
	justifyContent: "center",
	alignItems: "center",
	padding: "5rem 0px",
	fontFamily: "DM Sans",
};
const headingStyle = {
	marginTop: "1rem",
	fontSize: "1rem",
	fontWeight: FONT_WEIGHT.BOLD,
	color: "#fff",
};
const tipStyle = {
	textAlign: TEXT_ALIGN.CENTER,
	marginTop: "0.8rem",
	fontSize: "0.9rem",
	color: "#FFFFFF",
};
const goBackStyle = {
	textAlign: TEXT_ALIGN.CENTER,
	fontFamily: "DM Sans",
	fontStyle: "normal",
	fontWeight: 500,
	fontSize: "0.75rem",
	textDecorationLine: "underline",
	color: "#FFFFFF",
};

export { SelectElementPlaceholder };

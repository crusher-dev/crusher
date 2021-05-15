import React, { ChangeEvent } from "react";
import { COLOR_CONSTANTS } from "../../../ui/colorConstants";
import { RESIZE, WHITE_SPACE } from "../../../interfaces/css";

interface iAddressBarProps {
	value: string;
	forwardRef?: React.Ref<any>;
	onChange: (event: ChangeEvent) => void;
	onKeyDown: (event: KeyboardEvent) => void;
}

const AddressBar = (props: iAddressBarProps) => {
	const { value, onChange, onKeyDown, forwardRef } = props;

	return (
		<>
			<div style={addressBarStyle} id="address-bar" className={"address_bar"}>
				<div style={sslContainerStyle}>
					<img style={sslIconStyle} src={chrome.runtime.getURL("/icons/ssl.svg")} />
				</div>
				<textarea
					ref={forwardRef}
					style={addressBarInputStyle}
					onChange={onChange as any}
					onKeyDown={onKeyDown as any}
					contentEditable={true}
					value={value as any}
				></textarea>
			</div>
			<div style={goBtnStyle}>Go</div>
		</>
	);
};

const goBtnStyle = {
	background: COLOR_CONSTANTS.TRINARY,
	border: `solid ${COLOR_CONSTANTS.BORDER}`,
	color:"#fff",
	width:"4.8rem",
	borderTopRightRadius:"10px",
	borderBottomRightRadius:"10px",
	display:"flex",
	alignItems:"center",
	justifyContent:"center",
	cursor:"pointer",
	borderWidth: "1px",
};

const addressBarStyle = {
	width: "33.9%",
	maxWidth: "25rem",
	background: COLOR_CONSTANTS.PRIMARY,
	overflow: "hidden",
	display: "flex",
	alignItems: "center",
	border: `solid ${COLOR_CONSTANTS.BORDER}`,
	borderWidth: "1px",
	color: "#fff",
	borderRadius: "0.1rem",
};

const addressBarInputStyle = {
	fontSize: "0.77rem",
	outline: "none",
	display: "flex",
	padding: "0.6rem 0.5rem",
	alignItems: "center",
	background: "transparent",
	color: "#fff",
	maxHeight: "2rem",
	whiteSpace: WHITE_SPACE.NOWRAP,
	overflow: "hidden",
	border: 0,
	resize: RESIZE.NONE,
	width: "100%",
};

const sslContainerStyle = {
	width: "1.75rem",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	paddingLeft: "0.5rem",
};

const sslIconStyle = { width: "0.8rem" };

export { AddressBar };

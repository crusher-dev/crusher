import React, { ChangeEvent } from "react";
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
		<div style={addressBarStyle} className={"address_bar"}>
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

			<style>{`
				.address_bar:hover{
					background: rgba(28,31,38, 1) !important;
				}
			`}</style>
		</div>
	);
};

const addressBarStyle = {
	width: "33.9%",
	maxWidth: "25rem",
	padding: "0 0.1rem",
	background: "rgba(28,31,38, 0.7)",
	overflow: "hidden",
	display: "flex",
	alignItems: "center",
	color: "#fff",
	borderRadius: "0.1rem",
	marginLeft: "1.6rem",
	paddingRight: "1rem",
};

const addressBarInputStyle = {
	flex: 1,
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

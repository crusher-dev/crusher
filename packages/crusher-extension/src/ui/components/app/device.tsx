import React from "react";
import { OVERFLOW, POSITION } from "../../../interfaces/css";
import { Conditional } from "../conditional";
import { iDevice } from "../../../../../crusher-shared/types/extension/device";

interface iDeviceProps {
	url: string;
	device: iDevice;
	forwardRef?: any;
	isDisabled?: boolean;
	isMobile?: boolean;
}

const Device = (props: iDeviceProps) => {
	const { isMobile, device, url, forwardRef, isDisabled } = props;

	return (
		<div style={previewBrowserStyle}>
			<Conditional If={isDisabled}>
				<div style={blockCoverStyle}></div>
			</Conditional>

			<div
				className={isMobile ? "smartphone" : ""}
				style={{
					width: device.width,
					height: device.height,
				}}
			>
				<div className="content" style={{ width: "100%", height: "100%" }}>
					<iframe
						ref={forwardRef}
						style={browserFrameStyle}
						scrolling="auto"
						sandbox="allow-scripts allow-forms allow-same-origin"
						id="screen-iframe-5984a019-7f2b-4f58-ad11-e58cc3cfa634"
						title={device.name}
						src={url}
					/>
				</div>
			</div>
		</div>
	);
};

const blockCoverStyle = {
	position: POSITION.ABSOLUTE,
	left: 0,
	top: 0,
	width: "100%",
	height: "100%",
	background: "transparent",
	zIndex: 99999,
};

const previewBrowserStyle = {
	flex: 1,
	maxWidth: "75vw",
	display: "flex",
	justifyContent: "center",

	overflowY: OVERFLOW.AUTO,
	background: "#010101",
	position: POSITION.RELATIVE,
	alignItems: "center",
	height: "calc(100vh - 2.58rem)",
};

const browserFrameStyle = {
	border: "none",
	display: "block",
	borderRadius: 2,
	maxWidth: "100%",
	backgroundColor: "#fff",
	width: "100%",
	height: "100%",
};

export { Device };

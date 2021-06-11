import React, { useEffect } from "react";
import { OVERFLOW, POSITION, TEXT_ALIGN } from "../../../interfaces/css";
import { Conditional } from "../conditional";
import { iDevice } from "../../../../../crusher-shared/types/extension/device";
import { useSelector } from "react-redux";
import { isRecorderScriptBooted } from "../../../redux/selectors/recorder";
import { COLOR_CONSTANTS } from "../../../ui/colorConstants";

interface iDeviceProps {
	url: string;
	device: iDevice;
	forwardRef?: any;
	isDisabled?: boolean;
	isMobile?: boolean;
}

const Device = (props: iDeviceProps) => {
	const isIframeLoaded = useSelector(isRecorderScriptBooted);
	const { isMobile, device, url, forwardRef, isDisabled } = props;

	useEffect(() => {
		console.log(isIframeLoaded, "____ loaded value ");
		window.onload = function () {
			return forwardRef.current.click();
		};
	}, []);

	return (
		<div style={previewBrowserStyle}>
			<Conditional If={isDisabled}>
				<div style={blockCoverStyle}></div>
			</Conditional>
			<Conditional If={!isIframeLoaded}>
				<div className="absolute flex h-full w-full justify-center items-center">
					<div>
						<img style={pageLoadingCoverIconStyle} src={chrome.runtime.getURL("/assets/loading_frame_illustration.svg")} />
						<div style={pageLoadingCoverTextStyle}>{"Please wait while we're loading next page"}</div>
					</div>
				</div>
			</Conditional>
			<div
				className={isMobile ? "smartphone" : ""}
				style={{
					width: device.width,
					height: device.height,
				}}
			>
				<div className="content" style={browserFrameContainerStyle}>
					<iframe
						ref={forwardRef}
						style={browserFrameStyle}
						scrolling="auto"
						sandbox="allow-scripts allow-forms allow-same-origin"
						id="device_browser"
						name={"crusher_iframe"}
						title={device.name}
						src={url}
					/>
				</div>
			</div>
		</div>
	);
};

const pageLoadingCoverIconStyle = {
	marginLeft: "0.35rem",
};

const pageLoadingCoverTextStyle = {
	marginTop: "1.5rem",
	fontFamily: "DM Sans",
	fontWeight: 500,
	fontSize: "0.9rem",
	textAlign: TEXT_ALIGN.CENTER,
	color: "#DBDBDB",
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
	display: "flex",
	justifyContent: "center",
	overflowY: OVERFLOW.AUTO,
	background: "#0A0A0A",
	position: POSITION.RELATIVE,
	alignItems: "center",
	borderTopRightRadius: "2rem",
	border: `solid ${COLOR_CONSTANTS.BORDER}`,
	borderWidth: "2px",
	borderLeft: "none",
	borderBottom: "none",
};

const browserFrameStyle = {
	border: "none",
	display: "block",
	maxWidth: "100%",
	backgroundColor: "#010101",
	width: "100%",
	height: "100%",
};

const browserFrameContainerStyle = {
	width: "100%",
	height: "100%",
};

export { Device };

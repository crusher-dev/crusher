import React, { useEffect } from "react";
import { OVERFLOW, POSITION, TEXT_ALIGN } from "../../../interfaces/css";
import { Conditional } from "../conditional";
import { iDevice } from "@shared/types/extension/device";
import { useSelector } from "react-redux";
import { isRecorderScriptBooted } from "../../../redux/selectors/recorder";
import { COLOR_CONSTANTS } from "../../colorConstants";
import { WebviewTag } from "electron";
import webviewTag = Electron.Renderer.webviewTag;

interface iDeviceProps {
	url: string;
	device: iDevice;
	forwardRef?: any;
	isDisabled?: boolean;
	isMobile?: boolean;
}

const Device = (props: iDeviceProps) => {
	const isWebviewLoaded = useSelector(isRecorderScriptBooted);
	const { isMobile, device, url, forwardRef, isDisabled } = props;

	useEffect(() => {
		console.log(isWebviewLoaded, "____ loaded value ");
		window.onload = function () {
			return forwardRef.current.click();
		};
	}, []);

	return (
		<div style={previewBrowserStyle}>
			<Conditional If={isDisabled}>
				<div style={blockCoverStyle}></div>
			</Conditional>
			<Conditional If={!isWebviewLoaded}>
				<div style={{ background: "rgba(10, 10, 10, 0.925)" }} className="absolute flex h-full w-full justify-center items-center">
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
					height: device.height, //need to fix UI bug here
				}}
			>
				<div className="content" style={browserFrameContainerStyle}>
					<webview
						ref={forwardRef}
						style={browserFrameStyle}
						id="device_browser"
						nodeintegration={true}
						preload={"file://" + (window as any).electron.getAppPath() + "/webViewPreload.js"}
						//@ts-ignore
						enableremotemodule={"true"}
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
	minHeight: "90%",
};

const browserFrameStyle = {
	border: "none",
	display: "inline-flex",
	maxWidth: "100%",
	backgroundColor: "#fff",
	width: "100%",
	height: "100%",
};

const browserFrameContainerStyle = {
	width: "100%",
	height: "100%",
};

export { Device };

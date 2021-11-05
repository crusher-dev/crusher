import React, { useEffect } from "react";
import { OVERFLOW, POSITION, TEXT_ALIGN } from "../../../interfaces/css";
import { Conditional } from "../conditional";
import { iDevice } from "@shared/types/extension/device";
import { useSelector } from "react-redux";
import { isRecorderScriptBooted, isReplayingTest } from "../../../redux/selectors/recorder";
import { COLOR_CONSTANTS } from "../../colorConstants";
import { WebviewTag } from "electron";
import webviewTag = Electron.Renderer.webviewTag;
import { LoadingIcon } from "crusher-electron-app/src/extension/assets/icons";

interface iDeviceProps {
	url: string;
	device: iDevice;
	forwardRef?: any;
	isDisabled?: boolean;
	isMobile?: boolean;
}

const Device = (props: iDeviceProps) => {
	const isWebviewLoaded = useSelector(isRecorderScriptBooted);
	const isTestGettingReplayed = useSelector(isReplayingTest);

	const { isMobile, device, url, forwardRef, isDisabled } = props;

	useEffect(() => {
		console.log(isWebviewLoaded, "____ loaded value ");
		window.onload = function () {
			return forwardRef.current.click();
		};
	}, []);

	useEffect(() => {
		if (!isDisabled) {
			(window as any).electron.focusOnWebView();
		}
	}, [isDisabled]);

	return (
		<div style={previewBrowserStyle}>
			{/* <Conditional If={isDisabled}>
				<div style={blockCoverStyle}></div>
			</Conditional> */}
			<Conditional If={isTestGettingReplayed}>
				<div style={{ background: "rgba(10, 10, 10, 0)" }} className="absolute flex h-full w-full justify-center items-center">
					<div style={{ background: "#EFBE3E", bottom: "1.75rem", width: device.width }} className="absolute flex justify-center items-center">
						<div>
							<div style={{ ...pageLoadingCoverTextStyle, marginTop: 0, display: "flex", alignItems: "center" }}>
								<span>{"We're running test for you. You can't perform actions right now"}</span>
								<LoadingIcon style={{width: 30, height: 30, marginLeft: 4}}/>
							</div>
						</div>
					</div>
				</div>
			</Conditional>

			<Conditional If={!isWebviewLoaded}>
				<div style={{ background: "rgba(10, 10, 10, 0.925)" }} className="absolute flex h-full w-full justify-center items-center">
					<div>
						<img style={pageLoadingCoverIconStyle} src={chrome.runtime.getURL("/assets/loading_frame_illustration.svg")} />
						<div style={{...pageLoadingCoverTextStyle, color: "#fff"}}>{"Please wait while we're loading next page"}</div>
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
						src={`about:blank?url=${encodeURIComponent(url)}`}
						partition={"crusher"}
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
	color: "#000",
	padding: "0.2rem",
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

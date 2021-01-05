import { render } from "react-dom";
import React, { useState } from "react";
import { POSITION, TEXT_ALIGN } from "../interfaces/css";
import devices from "../../../crusher-shared/constants/devices";
import Tab = chrome.tabs.Tab;
import { AdvancedURL } from "../utils/url";
import { SelectDeviceInput } from "./containers/popup/selectDeviceInput";

interface iAppProps {
	tabId: number;
}

const App = (props: iAppProps) => {
	const { tabId } = props;

	const [selectedDevice, setSelectedDevice] = useState(devices[7].id);

	const handleStartRecordingClick = () => {
		chrome.tabs.get(tabId, (tab: Tab) => {
			chrome.tabs.create({
				url: AdvancedURL.generateCrusherExtensionUrl(
					tab.url as string,
					selectedDevice,
				),
			});

			window.close();
		});
	};

	return (
		<div id="container" style={containerStyle}>
			<div style={headingBlockStyle}>
				<div style={headingStyle}>Record a test</div>
			</div>
			<div style={subHeadingStyle}>Experience power of no-code testing ✨✨</div>
			<div style={paddingContainerStyle}>
				<SelectDeviceInput
					selectedDevice={selectedDevice}
					selectDevice={setSelectedDevice}
				/>
				<div style={buttonStyle} onClick={handleStartRecordingClick}>
					Start recording
				</div>
				<a href={"https://crusherdev.page.link/chrome_video"} target={"blank"}>
					<div style={watchBlockStyle}>
						<img src={chrome.runtime.getURL("icons/play.svg")} />
						<div style={watchTextStyle}>Watch : How to record test in 2 mins?</div>
					</div>
				</a>
				<a href="https://crusherdev.page.link/help_chrome" target={"blank"}>
					<div style={smallButtonStyle}>Need help?</div>
				</a>
			</div>
			<link rel="stylesheet" href={chrome.runtime.getURL("/styles/popup.css")} />
			<link rel="stylesheet" href={chrome.runtime.getURL("/styles/fonts.css")} />
			<style>
				{`
        	html, body{
          	padding:0;
            margin:0;
            min-height: 300px;
            max-height: 300px;
          }
        `}
			</style>
		</div>
	);
};

const containerStyle = {
	background: "#141427",
	color: "#FFFFFF",
	width: 340,
	padding: 0,
};

const paddingContainerStyle = {
	padding: "0 1.25rem",
};

const headingBlockStyle = {
	display: "flex",
	padding: "1.75rem 1.25rem 0 1.25rem",
};

const headingStyle = {
	fontFamily: "DM Sans",
	fontSize: "1.1rem",
	fontWeight: 700,
	lineHeight: "1rem",
	marginRight: "auto",
};

const subHeadingStyle = {
	fontFamily: "DM Sans",
	fontSize: ".9rem",
	fontWeight: 400,
	marginRight: "auto",
	padding: "0 .5rem 1.25rem 1.25rem",
	marginTop: ".5rem",
};

const buttonStyle = {
	background: "#5B76F7",
	border: "1px solid #5B76F7",
	padding: "0.7rem 0.9rem",
	color: "#fff",
	fontSize: "1rem",
	cursor: "pointer",
	fontWeight: 700,
	fontFamily: "DM Sans",
	marginTop: "1rem",
	textAlign: TEXT_ALIGN.CENTER,
	borderRadius: "0.2rem",
};

const watchBlockStyle = {
	display: "flex",
	width: "auto",
	margin: "0 auto",
	marginTop: "2.75rem",
	justifyContent: "center",
	alignItems: "center",
	cursor: "pointer",
	textDecoration: "none",
};

const watchTextStyle = {
	marginLeft: "1.1rem",
	fontFamily: "DM Sans",
	fontWeight: 600,
	fontSize: "0.9rem",
	color: "#fff",
};

const smallButtonStyle = {
	background: "#04040E",
	display: "inline-block",
	position: POSITION.RELATIVE,
	left: "50%",
	transform: "translateX(-50%)",
	borderRadius: "0.2rem",
	fontWeight: 500,
	fontFamily: "DM Sans",
	fontSize: "0.84rem",
	color: "#fff",
	padding: "0.5rem 2.7rem",
	cursor: "pointer",
	marginLeft: "auto",
	marginRight: "auto",
	marginTop: "1rem",
	marginBottom: "2.5rem",
	width: "auto",
};

// Get Active Tab id (i.e, tabId) and check if the recorder is one or not (i.e, isSessionGoingOn).
// Pass both of them to our component App
chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
	render(<App tabId={tabs[0].id} />, document.body);
});

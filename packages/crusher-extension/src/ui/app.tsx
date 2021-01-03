import React, { useRef } from "react";
import { render } from "react-dom";
import { SidebarActionsBox } from "./containers/app/sidebarActionsBox";
import { BrowserWindow } from "./containers/app/browserWindow";
import configureStore from "../redux/store";
import { Provider } from "react-redux";
import { recorderMessageListener } from "../messageListener";

const App = () => {
	const deviceIframeRef = useRef<HTMLIFrameElement>(null);
	const saveTest = () => {
		console.log("Saving test...");
	};

	return (
		<div style={containerStyle}>
			<BrowserWindow
				deviceIframeRef={deviceIframeRef}
				saveTestCallback={saveTest}
				isInspectModeOn={true}
			/>
			<SidebarActionsBox />
			<link
				rel="stylesheet"
				href={chrome.runtime.getURL("/styles/devices.min.css")}
			/>
			<link rel="stylesheet" href={chrome.runtime.getURL("/styles/app.css")} />
			<link rel="stylesheet" href={chrome.runtime.getURL("/styles/fonts.css")} />
		</div>
	);
};

const containerStyle = {
	display: "flex",
	height: "auto",
	background: "rgb(40, 40, 40)",
};

window.addEventListener("message", recorderMessageListener);

render(
	<Provider store={configureStore()}>
		<App />
	</Provider>,
	document.querySelector("#root"),
);

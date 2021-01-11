import React, { useMemo, useRef } from "react";
import { render } from "react-dom";
import { SidebarActionsBox } from "./containers/app/sidebarActionsBox";
import { BrowserWindow } from "./containers/app/browserWindow";
import configureStore, { getStore } from "../redux/store";
import { Provider } from "react-redux";
import { recorderMessageListener } from "../messageListener";
import ReactModal from "react-modal";
import { ModalManager } from "./containers/app/modals";
import { CodeGenerator } from "../../../code-generator/src/generator";
import { AdvancedURL } from "../utils/url";
import { ACTIONS_IN_TEST } from "../../../crusher-shared/constants/recordedActions";
import { recordAction } from "../redux/actions/actions";

const App = () => {
	const deviceIframeRef = useRef<HTMLIFrameElement>(null);
	const saveTest = () => {
		const store = getStore();
		const steps = store.getState().actions.list;
		const codeGenerator = new CodeGenerator();
		console.log(codeGenerator.parse(steps));
	};

	useMemo(() => {
		const store = getStore();
		const device = AdvancedURL.getDeviceFromCrusherExtensionUrl(
			window.location.href,
		);
		const userAgent = AdvancedURL.getUserAgentFromUrl(
			AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href),
		);
		store.dispatch(
			recordAction({
				type: ACTIONS_IN_TEST.SET_DEVICE,
				payload: {
					meta: {
						device: device,
						userAgent: userAgent,
					},
				},
			}),
		);

		window.addEventListener(
			"message",
			recorderMessageListener.bind(window, deviceIframeRef),
		);
	}, []);

	return (
		<div style={containerStyle}>
			<BrowserWindow
				deviceIframeRef={deviceIframeRef}
				saveTestCallback={saveTest}
			/>
			<SidebarActionsBox deviceIframeRef={deviceIframeRef} />
			<ModalManager deviceIframeRef={deviceIframeRef} />
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

ReactModal.setAppElement("#root");

render(
	<Provider store={configureStore()}>
		<App />
	</Provider>,
	document.querySelector("#root"),
);

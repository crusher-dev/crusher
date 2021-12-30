import React, { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { SidebarActionsBox } from "./containers/app/sidebarActionsBox";
import { BrowserWindow } from "./containers/app/browserWindow";
import configureStore, { getStore } from "../redux/store";
import { Provider } from "react-redux";
import { recorderMessageListener } from "../messageListener";
import ReactModal from "react-modal";
import { ModalManager } from "./containers/app/modals";
import { AdvancedURL } from "../utils/url";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { recordAction } from "../redux/actions/actions";
import { Conditional } from "./components/conditional";
import { StartupModal } from "./containers/app/modals/startupModal";
import * as _url from "url";
import "../style/main.css";
import { openLinkInNewTab } from "../utils/dom";
import { saveTest } from "../utils/app";

const App = () => {
	const deviceIframeRef = useRef<HTMLWebViewElement>(null);
	const [recordingStartTime] = useState(new Date());
	const [url] = useState(AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href));

	useEffect(() => {
		const isReturningUser = localStorage.getItem("lastVisit");
		if (isReturningUser) {
			localStorage.setItem("lastVisit", Date.now().toString());
		}
	}, []);

	useMemo(() => {
		const store = getStore();
		const device = AdvancedURL.getDeviceFromCrusherExtensionUrl(window.location.href);
		const userAgent = AdvancedURL.getUserAgentFromUrl(AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href) as string);
		store.dispatch(
			recordAction({
				type: ActionsInTestEnum.SET_DEVICE,
				payload: {
					meta: {
						device: device,
						userAgent: userAgent,
					},
				},
			}),
		);
		(window as any).electron.host.addEventListener("message", recorderMessageListener.bind(window, deviceIframeRef));
	}, []);

	return (
		<div style={containerStyle}>
			<Conditional If={url}>
				<BrowserWindow deviceIframeRef={deviceIframeRef} verifyAndSaveTestCallback={saveTest} />
				<SidebarActionsBox deviceIframeRef={deviceIframeRef} />
				<ModalManager deviceIframeRef={deviceIframeRef} />
			</Conditional>
			<Conditional If={!url}>
				<div style={{ height: "100vh", width: "100vh" }}>
					<StartupModal isOpen={true} />
				</div>
			</Conditional>
			<link rel="stylesheet" href={chrome.runtime.getURL("/styles/devices.min.css")} />
			<link rel="stylesheet" href={chrome.runtime.getURL("/styles/app.css")} />
			<link rel="stylesheet" href={chrome.runtime.getURL("/styles/fonts.css")} />

			<style>{`
					.CodeMirror {
						font-size: 0.9rem;
					}
				`}</style>
		</div>
	);
};

const containerStyle = {
	display: "flex",
	height: "100%",
	background: "rgb(17, 18, 19)",
};

ReactModal.setAppElement("#root");

render(
	<Provider store={configureStore()}>
		<App />
	</Provider>,
	document.querySelector("#root"),
);

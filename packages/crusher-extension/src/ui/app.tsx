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
import { ACTIONS_IN_TEST } from "../../../crusher-shared/constants/recordedActions";
import { recordAction } from "../redux/actions/actions";
import { submitPostDataWithForm } from "../utils/helpers";
import { resolveToBackendPath } from "../../../crusher-shared/utils/url";
import { Conditional } from "./components/conditional";
import { StartupModal } from "./containers/app/modals/startupModal";
import "../style/main.css";

const App = () => {
	const deviceIframeRef = useRef<HTMLIFrameElement>(null);
	const [recordingStartTime] = useState(new Date());
	const [url] = useState(AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href));

	useEffect(() => {
		const isReturningUser = localStorage.getItem("lastVisit");
		if (isReturningUser) {
			localStorage.setItem("lastVisit", Date.now().toString());
		}
	}, []);

	const saveTest = () => {
		const store = getStore();
		const steps = store.getState().actions.list;
		const lastActionTime = store.getState().actions.last_action;

		if (!lastActionTime) {
			return;
		}

		submitPostDataWithForm(resolveToBackendPath("test/goToEditor", process.env.BACKEND_URL), {
			events: escape(JSON.stringify(steps)),
			totalTime: lastActionTime.getTime() - recordingStartTime.getTime(),
		});
	};

	useMemo(() => {
		const store = getStore();
		const device = AdvancedURL.getDeviceFromCrusherExtensionUrl(window.location.href);
		const userAgent = AdvancedURL.getUserAgentFromUrl(AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href) as string);
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
		window.addEventListener("message", recorderMessageListener.bind(window, deviceIframeRef));
	}, []);

	return (
		<div style={containerStyle}>
			<Conditional If={url}>
				<BrowserWindow deviceIframeRef={deviceIframeRef} saveTestCallback={saveTest} />
				<SidebarActionsBox deviceIframeRef={deviceIframeRef} />
				<ModalManager deviceIframeRef={deviceIframeRef} />
			</Conditional>
			<Conditional If={!url}>
				<StartupModal isOpen={true} />
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
	background: "rgb(40, 40, 40)",
};

ReactModal.setAppElement("#root");

render(
	<Provider store={configureStore()}>
		<App />
	</Provider>,
	document.querySelector("#root"),
);

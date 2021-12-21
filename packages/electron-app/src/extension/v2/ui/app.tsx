import React, { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import { css, Global } from "@emotion/react";
import { DeviceFrame } from "./components/DeviceFrame";
import { useAtom } from "jotai";
import { appStateAtom, appStateItemMutator } from "../store/atoms/global/appState";
import { hydrateApp } from "../store/utils/hydrate";
import configureStore, { getStore } from "../../redux/store";

import { AdvancedURL } from "../../utils/url";
import { recordAction } from "../../redux/actions/actions";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";
import { recorderMessageListener } from "../../messageListener";
import { Conditional } from "@dyson/components/layouts";
import { Provider } from "react-redux";
import { ModalManager } from "../../ui/containers/app/modals";
import "../../style/main.css";

const App = () => {
	const deviceIframeRef = useRef<HTMLWebViewElement>(null);
	const [url] = useState(AdvancedURL.getUrlFromCrusherExtensionUrl(window.location.href));
	const selectedDevice = AdvancedURL.getDeviceFromCrusherExtensionUrl(window.location.href);
    const [appState, setAppStateItem] = useAtom(appStateAtom);


	useMemo(() => {
		hydrateApp(setAppStateItem);

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
		(window as any).electron.host && (window as any).electron.host.addEventListener("message", recorderMessageListener.bind(window, deviceIframeRef));
	}, []);

	return (
		<div css={containerStyle}>
			<Global styles={globalStyles} />
			<div css={bodyStyle}>

				<Toolbar initialUrl={url} initialSelectedDevice={selectedDevice ? selectedDevice.id : null} CSS={toolbarStyle} />
					<DeviceFrame deviceIframeRef={deviceIframeRef} targetUrl={url} selectedDevice={selectedDevice} CSS={deviceFrameContainerStyle}/>
			</div>
			<Sidebar deviceIframeRef={deviceIframeRef} CSS={sidebarStyle}/>
			<ModalManager deviceIframeRef={deviceIframeRef} />

			<style>{`
					.CodeMirror {
						font-size: 0.9rem;
					}
				`}</style>
		</div>
	);
};

const containerStyle = css`
	display: flex;
	background: #020202;
	width: 100%;
	overflow-x: hidden;
	height: 100vh;
	color: white;
`;
const bodyStyle = css`
	flex: 1;
	max-width: calc(100% - 350rem);
	display: grid;
	grid-template-rows: 62rem;
	flex-direction: column;
`;
const sidebarStyle = css`
	padding: 1rem;
	width: 350rem;
	background-color: #111213;
`;
const toolbarStyle = css`
	background-color: #111213;
	padding: 5rem;
	min-height: 60rem;
`;
const deviceFrameContainerStyle = css`
	flex: 1;
	overflow: auto;
`;
const globalStyles = css`
	body {
		margin: 0;
		padding: 0;
		min-height: "100vh";
		max-width: "100vw";
	}
	.custom-scroll::-webkit-scrollbar {
		width: 12rem;
	}

	.custom-scroll::-webkit-scrollbar-track {
		background-color: #0a0b0e;
		box-shadow: none;
	}

	.custom-scroll::-webkit-scrollbar-thumb {
		background-color: #1b1f23;
		border-radius: 100rem;
	}

	.custom-scroll::-webkit-scrollbar-thumb:hover {
		background-color: #272b31;
		border-radius: 100rem;
	}
`;

render(		<Provider store={configureStore()}>
<App /></Provider>, document.querySelector("#root"));

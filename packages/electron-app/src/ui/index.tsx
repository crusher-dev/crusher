import React from "react";
import { css, Global } from '@emotion/react'
import { render } from "react-dom";
import { Toolbar } from './components/toolbar';
import { DeviceFrame } from './components/device-frame';
import { Sidebar } from './components/sidebar';
import "../../static/assets/styles/tailwind.css";
import configureStore from "../store/configureStore";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import { getInitialStateRenderer } from 'electron-redux';
import { ipcRenderer } from "electron";
import { resetRecorderState, setDevice, setIsWebViewInitialized, updateRecorderState } from "../store/actions/recorder";
import { TRecorderState } from "../store/reducers/recorder";
import { getRecorderInfo, isWebViewInitialized } from "../store/selectors/recorder";
import { performNavigation, performReplayTest, saveSetDeviceIfNotThere } from "./commands/perform";
import {devices} from "../devices";
import { iReduxState } from "../store/reducers/index";
import { IDeepLinkAction } from "../types";
import { CrusherTests } from "../lib/tests";
import { Emitter } from "event-kit";
import { setSessionInfoMeta } from "../store/actions/app";
import { getAppSessionMeta } from "../store/selectors/app";

const emitter = new Emitter();

const App = () => {
	const store = useStore();
	const recorderInfo = useSelector(getRecorderInfo);
	
	React.useEffect(() => {
		console.log("HELLO FROM RENDERER");
		ipcRenderer.on("webview-initialized", (event: Electron.IpcRendererEvent, { initializeTime }) => {
			store.dispatch(setIsWebViewInitialized(true));
			const recorderInfo = getRecorderInfo(store.getState() as any);
			const device = devices.find(device => device.id === recorderInfo.device as any);
			saveSetDeviceIfNotThere(device, store);
			if(!recorderInfo.url) {
				emitter.emit("renderer-webview-initialized");
			} else {
				performNavigation(recorderInfo.url, store);
			}
		});

		ipcRenderer.send("renderer-ready", /* @TODO Add correct rendering time */ 1500);

		ipcRenderer.on("url-action",   (event: Electron.IpcRendererEvent, { action }: { action: IDeepLinkAction }) => {
			if(action.commandName === "replay-test") {
				const isWebViewPresent = isWebViewInitialized(store.getState() as any);
				const sessionInfoMeta = getAppSessionMeta(store.getState() as any);
				store.dispatch(setSessionInfoMeta({
					...sessionInfoMeta,
					editing: {
						testId: action.args.testId,
					}
				}));

				if(isWebViewPresent) {
					performReplayTest(action.args.testId);
				} else {
					store.dispatch(setDevice(devices[0].id));
					emitter.once("renderer-webview-initialized", () => {
						console.log("Render webview initialized listener called");
						performReplayTest(action.args.testId)
					})
				}
			}
		});

		window.onbeforeunload = () => { 
			store.dispatch(resetRecorderState());
		};
	}, []);

	return (
        <div css={containerStyle}>
            <Global styles={globalStyles} />
            <div css={bodyStyle}>
                    <Toolbar css={toolbarStyle} />
                    <DeviceFrame css={deviceFrameContainerStyle} />
            </div>
            <Sidebar css={sidebarStyle} />
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

const initialReduxState: iReduxState = getInitialStateRenderer();
initialReduxState.app.shouldShowOnboardingOverlay = localStorage.getItem("app.showShouldOnboardingOverlay") === "false" ? false : true;

const store = configureStore(initialReduxState, "renderer");
render(
<Provider store={store}>
        <App />
</Provider>
, document.querySelector("#app-container"));

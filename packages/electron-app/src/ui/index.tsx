import React from "react";
import { css, Global } from '@emotion/react'
import { render } from "react-dom";
import { Toolbar } from './components/toolbar';
import { DeviceFrame } from './components/device-frame';
import { Sidebar } from './components/sidebar';
import "../assets/styles/tailwind.css";
import configureStore from "../store/configureStore";
import { Provider, useDispatch, useSelector, useStore } from "react-redux";
import { getInitialStateRenderer } from 'electron-redux';
import { ipcRenderer } from "electron";
import { resetRecorderState, updateRecorderState } from "../store/actions/recorder";
import { TRecorderState } from "../store/reducers/recorder";
import { getRecorderInfo } from "../store/selectors/recorder";
import { performNavigation } from "./commands/perform";

const App = () => {
	const store = useStore();
	
	React.useEffect(() => {
		ipcRenderer.on("webview-initialized", (event: Electron.IpcRendererEvent, { initializeTime }) => {
			const recorderInfo = getRecorderInfo(store.getState() as any);
			console.log("Webview initialized in: " + initializeTime);
			
			performNavigation(recorderInfo.url, store);
		})

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

const store = configureStore(getInitialStateRenderer(), "renderer");
render(
<Provider store={store}>
        <App />
</Provider>
, document.querySelector("#app-container"));

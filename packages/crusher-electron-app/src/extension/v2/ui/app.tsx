import React, { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import { css, Global } from "@emotion/react";
import { DeviceFrame } from "./components/DeviceFrame";
import { useAtom } from "jotai";
import { appStateItemMutator } from "../store/atoms/global/appState";
import { hydrateApp } from "../store/utils/hydrate";

const App = () => {
	const deviceIframeRef = useRef<HTMLWebViewElement>(null);
	const [, setAppStateItem] = useAtom(appStateItemMutator);

	useEffect(hydrateApp.bind(this, setAppStateItem), []);

	return (
		<div css={containerStyle}>
			<Global styles={globalStyles} />
			<div css={bodyStyle}>
				<div css={toolbarStyle}>
					<Toolbar />
				</div>
				<div css={deviceFrameContainerStyle}>
					<DeviceFrame/>
				</div>
			</div>
			<div css={sidebarStyle}>
				<Sidebar />
			</div>
		</div>
	);
};

const containerStyle = css`
	display: flex;
	background: #020202;
	width: 100vw;
	height: 100vh;
	color: white;
`;
const bodyStyle = css`
	flex: 1;
	display: flex;
	flex-direction: column;
`;
const sidebarStyle = css`
	padding: 1rem;
	min-width: 350rem;
	background-color: #111213;
`;
const toolbarStyle = css`
	background-color: #111213;
	padding: 5rem;
`;
const deviceFrameContainerStyle = css`
	flex: 1;
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

render(<App />, document.querySelector("#root"));

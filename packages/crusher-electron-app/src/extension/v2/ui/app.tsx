import React, { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import Toolbar from "./components/Toolbar";
import Info from "./components/Info";
import Sidebar from "./components/Sidebar";
import { css, Global } from "@emotion/react";

const App = () => {
	const deviceIframeRef = useRef<HTMLWebViewElement>(null);

	return (
		<div css={containerStyle}>
			<Global styles={globalStyles} />
			<div css={bodyStyle}>
				<div css={toolbarStyle}>
					<Toolbar />
				</div>
				{/* <div css={chromeStyle}></div> */}
				<div css={infoStyle}>
					<Info />
				</div>
			</div>
			<div css={sidebarStyle}>
				<Sidebar />
			</div>
		</div>
	);
};
render(<App />, document.querySelector("#root"));

const containerStyle = css`
	display: grid;
	grid-template-columns: 1fr auto;
	background: #020202;
	width: 100vw;
	height: 100vh;
	color: white;
`;
const bodyStyle = css``;
const sidebarStyle = css`
	padding: 1rem;
	width: 25vw;
	background-color: #111213;
`;
const toolbarStyle = css`
	background-color: #111213;
	padding: 5rem;
`;
const infoStyle = css`
	position: fixed;
	display: block;
	bottom: 140rem;
	left: 40rem;
`;
const globalStyles = css`
	body {
		margin: 0;
		padding: 0;
		min-height: "100vh";
		max-width: "100vw";
	}
	.custom-scroll::-webkit-scrollbar {
		width: 12px;
	}

	.custom-scroll::-webkit-scrollbar-track {
		background-color: #0a0b0e;
		box-shadow: none;
	}

	.custom-scroll::-webkit-scrollbar-thumb {
		background-color: #1b1f23;
		border-radius: 100px;
	}

	.custom-scroll::-webkit-scrollbar-thumb:hover {
		background-color: #272b31;
		border-radius: 100px;
	}
`;

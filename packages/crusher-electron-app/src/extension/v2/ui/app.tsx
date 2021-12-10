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
			<Global
				styles={css`
					body {
						margin: 0;
						padding: 0;
						min-height: "100vh";
						max-width: "100vw";
					}
				`}
			/>
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

const containerStyle = css`
	display: grid;
	background: #121212;
	width: 100vw;
	height: 100vh;
	color: white;
`;
const bodyStyle = css`
	grid-column: 1 / span 1;
`;
const sidebarStyle = css`
	padding: 1rem;
	grid-column: 2;
	background-color: #232323;
`;
const toolbarStyle = css`
	background-color: #232323;
	padding: 5rem;
`;
const infoStyle = css`
	position: fixed;
	display: block;
	bottom: 140rem;
	left: 40rem;
`;

render(<App />, document.querySelector("#root"));

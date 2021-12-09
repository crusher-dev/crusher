import React, { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import "./style.css";

const App = () => {
	const deviceIframeRef = useRef<HTMLWebViewElement>(null);

	return (
		<div className="container">
			<div className="body">
				<div className="toolbar">Toolbar</div>
				<div className="chrome"></div>
				<div className="info">info Box</div>
			</div>
			<div className="sidebar">Action Sidebar</div>
		</div>
	);
};

render(<App />, document.querySelector("#root"));


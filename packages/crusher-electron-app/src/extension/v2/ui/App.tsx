import React, { useEffect, useMemo, useRef, useState } from "react";
import { render } from "react-dom";

const App = () => {
	const deviceIframeRef = useRef<HTMLWebViewElement>(null);

	return (
		<div style={containerStyle}>
			<h2>This is react apps</h2>
		</div>
	);
};

const containerStyle = {
	display: "flex",
	height: "100%"
};

render(
	<App />,
	document.querySelector("#root"),
);

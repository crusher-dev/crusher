import { jsx, css, ClassNames } from '@emotion/react'
import React, { useMemo, useRef, useState } from "react";
import { render } from "react-dom";
import { Button } from "@dyson/components/atoms/button/Button";
import "../assets/styles/main.css";

const App = () => {
	return (
		<div css={containerStyle}>
            <Button color={"tertiary-outline"} css={buttonStyle}>
                <span>Hello world</span>
            </Button>
		</div>
	);
};

const buttonStyle = css`
    background-color: green;
    :hover {
        background-color: green;
    }
`;


const containerStyle = css`
	display: flex;
	background: #020202;
	width: 100%;
	overflow-x: hidden;
	height: 100vh;
	color: white;
`;

render(<App />, document.querySelector("#app-container"));

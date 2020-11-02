import React, { useState } from "react";
import { css } from "@emotion/core";
import { emitter } from "@utils/mitt";

export function DialogBox() {
	const [message, setMessage] = useState(null);
	const [type, setType] = useState(null);

	emitter.on("error", function (message) {
		setMessage(message);
		setType("error");
		setTimeout(() => setMessage(null), 3000);
	});

	emitter.on("normal", function (message) {
		setMessage(message);
		setType("normal");
		setTimeout(() => setMessage(null), 3000);
	});

	emitter.on("success", function (message) {
		setMessage(message);
		setType("success");
		setTimeout(() => setMessage(null), 3000);
	});

	const isError = type === "error";
	const isSuccess = type === "success";
	const isNormal = type === "normal";
	return (
		<div
			css={[
				dialogStyle,
				isError && errorStyle,
				isNormal && normalStyle,
				isSuccess && successStyle,
				message && showDialog,
			]}
		>
			{message}
		</div>
	);
}

const dialogStyle = css`
  position: fixed;
    z-index: 100;
    max-width: 23.8rem;
    top: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    border-radius: 4px;
    font-size: 1.06rem;
    padding: .56rem;
    color: #fff;
    text-align: center;
    cursor: pointer;
     visibility: hidden;
}
	`;

const showDialog = css`
	visibility: visible;
	-webkit-animation: fadein 0.3s, fadeout 0.3s 3s;
	animation: fadein 0.3s, fadeout 0.3s 3s;
`;

const errorStyle = css`
	background: #dc476b;
	border: 2px solid #cc2f55;
`;
const successStyle = css`
	background: #5ccb61;
	border: 2px solid #23b729;
`;
const normalStyle = css`
	background: #2a3039;
	border: 2px solid #364152;
`;

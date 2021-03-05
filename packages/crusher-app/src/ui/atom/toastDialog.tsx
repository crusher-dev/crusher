import React, { useState } from "react";
import { css } from "@emotion/core";
import { emitter } from "@utils/mitt";
import { TOAST_TYPE, iToastInfo } from "@interfaces/toast";

export function ToastDialog() {
	const [message, setMessage] = useState(null as string | null);
	const [type, setType] = useState(null as TOAST_TYPE | null);
cd
	emitter.on("TOAST", function (info: any) {
		const { type, message } = info as iToastInfo;
		setMessage(message);
		setType(type);

		setTimeout(() => setMessage(null), 3000);
	});

	const isError = type === TOAST_TYPE.ERROR;
	const isSuccess = type === TOAST_TYPE.SUCCESS;
	const isInfo = type === TOAST_TYPE.INFO;

	return (
		<div
			css={[
				dialogStyle,
				isError && errorStyle,
				isInfo && normalStyle,
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
    z-index: 9999999;
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
`;
const successStyle = css`
	background: #5ccb61;
`;
const normalStyle = css`
	background: #2a3039;
`;

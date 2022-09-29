import React from "react";
import { css } from "@emotion/react";
import { sendSnackBarEvent } from "electron-app/src/app/containers/components/toast";

const LinkBox = ({ value, ...props }) => {
	const ref = React.useRef(null);

	const handleOnClick = () => {
		ref.current.select();
		document.execCommand("copy");
		sendSnackBarEvent({ type: "success", message: `Copied to clipbaord!` });
	};
	return (
		<div css={linkContainerStyle} onClick={handleOnClick} {...props}>
			<input ref={ref} css={inputCss} type={"text"} value={value}/>
		</div>
	);
};

const linkContainerStyle = css`
	background: rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.13);
	border-radius: 6px;
	padding: 12rem 18rem;

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 11rem;

	color: #888888;
`;
const inputCss = css`
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
`;

export { LinkBox };
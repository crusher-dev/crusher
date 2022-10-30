import React from "react";
import { css } from "@emotion/react";
import { shell } from "electron";
import { useNavigate } from "react-router-dom";
import { LinkPointer } from "../components/LinkPointer";

function Footer() {
	const navigate = useNavigate();
	const handleOpenDocs = React.useCallback(() => shell.openExternal("https://docs.crusher.dev"), []);
	const handleOpenSettings = React.useCallback(() => {
		navigate("/settings");
	}, []);

	return (
		<div css={navBarCss}>
			<LinkPointer showExternalIcon={false} onClick={handleOpenDocs}>
				Docs
			</LinkPointer>
			<LinkPointer showExternalIcon={false} onClick={handleOpenSettings} css={settingsCss}>
				Settings
			</LinkPointer>
		</div>
	);
}

const navBarCss = css`
	display: flex;

	font-size: 13rem;
	z-index: 99;
	width: 100%;
	color: rgba(255, 255, 255, 0.67);
	padding: 8rem 20rem;
	border-top: 0.5px solid rgba(153, 153, 153, 0.12);
	background: #0d0d0d;
`;
const settingsCss = css`
	margin-left: auto;
`;
export { Footer };

import React from "react";
import { css } from "@emotion/react";
import { shell } from "electron";
import { Link } from "../components/Link";

function Footer() {
    const handleOpenDocs = React.useCallback(() => shell.openExternal("https://docs.crusher.dev"), []);
    const handleOpenSettings = React.useCallback(() => shell.openExternal("https://app.crusher.dev"), []);

	return (
		<div css={navBarCss}>
			<Link onClick={handleOpenDocs}>Docs</Link>
            <Link onClick={handleOpenSettings} css={settingsCss}>Settings</Link>
		</div>
	);
}

const navBarCss = css`
	display: flex;
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 13rem;
	z-index: 99;
	width: 100%;
	color: rgba(255, 255, 255, 0.67);
	padding: 12rem 24rem;
`;
const settingsCss = css`
    margin-left: auto;
`;
export { Footer };

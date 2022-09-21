import React from "react";
import { css } from "@emotion/react";
import { linkOpen } from "electron-app/src/utils/url";

export function Link({ children, href, ...props }) {
	return (
		<span css={[linkStyle]} {...props} onClick={linkOpen.bind(this, href)}>
			{children}
		</span>
	);
}

const linkStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	color: #ffffff;
	:hover {
		opacity: 0.8;
	}

	font-weight: 500;
	font-size: 13px;
`;

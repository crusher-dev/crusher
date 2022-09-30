import React from "react";
import { css } from "@emotion/react";
import { linkOpen } from "electron-app/src/utils/url";

export function Link({ children, href, ...props }: any) {
	return (
		<span css={[linkStyle]} onClick={linkOpen.bind(this, href)} {...props}>
			{children}
		</span>
	);
}

const linkStyle = css`
	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	color: #ffffff;
	:hover {
		opacity: 0.8;
	}

	font-size: 13px;
	path {
		fill: #d1d5db;
	}
	color: #d1d5db;
	:hover {
		color: #bc66ff;
		opacity: 1;
		path {
			fill: #bc66ff;
		}
	}
`;

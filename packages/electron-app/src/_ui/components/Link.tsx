import React from "react";
import { css } from "@emotion/react";

export function Link({ children, ...props }) {
	return (
		<span css={[linkStyle]} {...props}>
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

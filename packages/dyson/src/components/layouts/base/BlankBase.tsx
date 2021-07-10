import React from "react";
import { css, jsx, SerializedStyles } from "@emotion/core";

export interface BlankBaseProps {
	children: React.ReactNode;
}

/**
 * Just a Dark container
 */
export const BlankBase: React.FC<BlankBaseProps> = ({ children }) => {
	return <div css={myStyle}>{children}</div>;
};

const myStyle = css`
	background: linear-gradient(180deg, #12161b 10.44%, #0c0d0e 100%);
	color: white;
	height: 100vh;
	width: 100%;
`;

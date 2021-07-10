import React from "react";
import { css, jsx } from "@emotion/core";

export interface BlankBaseProps {
	children: React.ReactNode;
	className?: string;
}

/**
 * Just a Dark container
 */
export const BlankBase: React.FC<BlankBaseProps> = ({ className, children }) => {
	return <div css={baseCSS} className={className}>{children}</div>;
};

const baseCSS = css`
  background-color: linear-gradient(179deg, #12161b 10.44%, #0c0d0e 100%);
	color: white;
	height: 100%;
	width: 100%;
`;

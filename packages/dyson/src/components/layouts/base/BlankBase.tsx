import React from "react";
import { css } from "@emotion/react";

export interface BlankBaseProps {
	children: React.ReactNode;
	className?: string;
}

/**
 * Just a Dark container
 */
export const BlankBase: React.FC<BlankBaseProps> = ({ className, children }) => {
	return (
		<div css={[baseCSS]} className={className}>
			{children}
		</div>
	);
};

const baseCSS = css`
    background: linear-gradient(rgb(8, 8, 8) 0%, rgb(10, 10, 10) 100%);
	color: white;
	height: 100vh;
	width: 100vw;
`;

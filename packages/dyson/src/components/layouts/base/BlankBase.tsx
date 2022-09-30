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
	background: linear-gradient(179deg, #0a0b0c 10.44%, #0c0d0e 100%);

	color: white;
	height: 100vh;
	width: 100vw;
`;

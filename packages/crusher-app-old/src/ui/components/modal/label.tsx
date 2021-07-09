import React from "react";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";

interface iLabelProps {
	id?: any;
	children: any;
	customCSS?: any;
}

const Label = (props: iLabelProps) => {
	const { id, customCSS, children } = props;

	return (
		<div css={[containerCSS, customCSS]}>
			<label htmlFor={id}>{children}</label>
		</div>
	);
};

const containerCSS = css`
	font-family: Cera Pro;
	font-weight: 700;
	font-size: ${16 / PIXEL_REM_RATIO}rem;
	color: #000000;
`;
export { Label };

import { css } from "@emotion/react";
import React from "react";

import { BlankBase } from "dyson/src/components/layouts";

const backgroundForBase = css`
	// background: url("/assets/img/background/dark_pattern.png"), linear-gradient(180deg, #101215 0%, #090a0c 105.81%), linear-gradient(0deg, #0e0e11, #0e0e11),
	// 	linear-gradient(0deg, #0a0b0d, #0a0b0d), #101215;
	//background: linear-gradient(180deg, #101215 0%, #090A0C 105.81%), linear-gradient(0deg, #0E0E11, #0E0E11), linear-gradient(0deg, #0A0B0D, #0A0B0D), #101215;
	background: #0c0c0d;
	color: #cfd0d0;
	background-position: center top;
	background-repeat: repeat;
	height: 100vh !important;
`;

interface CrusherBaseProps {
	children: React.ReactNode;
}

const CrusherBase = (props: CrusherBaseProps) => {
	return <BlankBase css={backgroundForBase}>{props.children}</BlankBase>;
};
export default CrusherBase;

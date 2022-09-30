import { css } from "@emotion/react";
import React from "react";

import { BlankBase } from "dyson/src/components/layouts";

const backgroundForBase = css`
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

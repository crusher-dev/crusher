import { css } from "@emotion/react";
import React from "react";

import { BlankBase } from "dyson/src/components/layouts";

const backgroundForBase = css`
	background: url("/assets/img/background/dark_pattern.png"), linear-gradient(179deg, #12161b 10.44%, #0c0d0e 100%);
	color: #cfd0d0;
	background-position: center top;
	background-repeat: repeat;
	height: 100vh !important;
`;

interface CrusherBaseProps {
	children: React.ReactNode;
}

const CrusherBase = (props: CrusherBaseProps) => <BlankBase css={backgroundForBase}>{props.children}</BlankBase>;
export default CrusherBase;

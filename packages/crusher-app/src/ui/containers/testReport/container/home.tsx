import { css } from "@emotion/react";
import { TextBlock } from "dyson/src/components/atoms";

import React from "react";
import { buildContainerWidth } from "../testReportScreen";


export function HomeSection() {

	return (
		<div
			className={"mt-20"}
			css={container}
		>
			<div css={buildContainerWidth} className="mx-auto">
				<div css={report} className="mt-36">
					<div css={topBar} className="flex items-center justify-between px-26">
						<TextBlock weight={500} fontSize={14} color={"#D1D1D1"}>Build logs</TextBlock>
						<TextBlock fontSize={12} color={"#7c7c7c"}>why this error?</TextBlock>
					</div>
					<div className="px-32 mt-24">
						<div css={progressBar}>
							<div id="progresss"></div>
						</div>
					</div>
				</div>
			</div>
		</div >
	);
}

const progressBar = css`
width: 100%;
background: linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08)), linear-gradient(0deg, rgba(0, 0, 0, 0.74), rgba(0, 0, 0, 0.74)), #0F1317;
border-radius: 8px;
height: 7px;

positon:relative;
#progresss{
	positon:absolute;
	top: 0;
	background: #C03CEF;
	border-radius: 8px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
height: 7px;
width: 70%;
}
`

const topBar = css`
border-bottom: 0.5px solid #242424;
width: 100%;
min-height: 44px;

`

const report = css`
background: linear-gradient(0deg, #000000, #000000), rgba(0, 0, 0, 0.5);
border-radius: 0px 0px 13px 13px;

width: 100%;
min-height: 560px;

border: 0.5px solid #242424;
border-radius: 12px;

`
const container = css`

				width: 100%;
				background: #0a0a0a;
				min-height: 100vh;
				display: flex;
				border-top-color: rgba(255, 255, 255, 0.04);
				border-top-width: 0.5rem;
				border-top-style: solid;

`







export default HomeSection;

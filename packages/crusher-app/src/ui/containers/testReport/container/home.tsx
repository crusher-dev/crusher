import { css } from "@emotion/react";
import { TextBlock } from "dyson/src/components/atoms";

import React from "react";
import { buildContainerWidth } from "../testReportScreen";


export function HomeSection() {

	return (
		<div
			className={"mt-20 flex-col"}
			css={container}
		>
			<Terminal />

			<div css={buildContainerWidth} className="mx-auto mt-24">
				<div>
					<TextBlock weight={500} className="mb-12" fontSize={14}>Environment</TextBlock>
					<TextBlock color="#CECECE" fontSize={13}>Run at Circle Ci</TextBlock>
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

#progress-item{
	positon:absolute;
	top: 105%;
	right: 100%;
	text-align: right;
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
				background: #090909;
				min-height: 100vh;
				display: flex;
				border-top-color: rgba(255, 255, 255, 0.04);
				border-top-width: 0.5rem;
				border-top-style: solid;

`




function Terminal() {
	return <div css={buildContainerWidth} className="mx-auto">
		<div css={report} className="mt-36 flex flex-col justify-between">
			<div>
				<div css={topBar} className="flex items-center justify-between px-26">
					<TextBlock weight={500} fontSize={14} color={"#D1D1D1"}>Build logs</TextBlock>
					<TextBlock fontSize={12} color={"#7c7c7c"}>why this error?</TextBlock>
				</div>
				<div className="px-32 mt-24">
					<div css={progressBar} className="mb-32">
						<div id="progresss"></div>
						<div id="progress-item" className="pt-12">90%done</div>
					</div>

					<div>
						<div className="flex mb-32 items-center">
							<TickSVG className="mr-12" />
							<TextBlock weight={400} fontSize={14} color={"#707070"}>Starting your test 🪄</TextBlock>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-32 px-26">
				<TextBlock color="#9B98B5" fontSize={13}>
					/enter command to see status
				</TextBlock>

			</div>
		</div>


	</div>;
}

function TickSVG(props) {
	return (
		<svg
			width={16}
			height={15}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g clipPath="url(#prefix__clip0_2372_4464)">
				<path
					d="M7.79 0C3.67 0 .317 3.365.317 7.5S3.67 15 7.79 15c4.12 0 7.473-3.365 7.473-7.5S11.91 0 7.79 0zm4.177 5.526L7.19 10.282c-.281.282-.73.3-1.03.019L3.632 7.989a.764.764 0 01-.056-1.053.74.74 0 011.049-.037L6.629 8.74l4.27-4.286c.3-.3.768-.3 1.068 0 .3.3.3.77 0 1.071z"
					fill="#3F3F3F"
				/>
			</g>
			<defs>
				<clipPath id="prefix__clip0_2372_4464">
					<path fill="#fff" d="M0 0h16v15H0z" />
				</clipPath>
			</defs>
		</svg>
	);
}



export default HomeSection;

import React from "react";
import { css } from "@emotion/core";
import notFoundSatellite from "../public/assets/img/illustration/not_found_satellite.png";
import { Conditional } from "@ui/components/common/Conditional";

function WebsiteHealthCard() {
	return (
		<div css={websiteHealthCSS}>
			<p>Current Website Health: </p>
			<button css={healthButtonCSS}>
				<div css={greenLightCSS}></div>Up: 99.9%
			</button>
		</div>
	);
}

export default function error404() {
	return (
		<div css={notFoundCSS}>
			<img src={notFoundSatellite} css={satelliteImageCSS} />
			<p css={pageUnreachableCSS}>This page is unreachable</p>
			<p css={thisAnErrorCSS}>
				{"If you think this is an error, we'll fix and create a test for it"}
			</p>

			<button css={reportButtonCSS}> Report Issue </button>
			<Conditional If={false}>
				<WebsiteHealthCard />
			</Conditional>
		</div>
	);
}

const satelliteImageCSS = css`
	width: 13.5rem;
	height: 13.5rem;
	left: 43.4rem;
	right: 11.8rem;
`;

const notFoundCSS = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
`;

const pageUnreachableCSS = css`
	font-family: Cera Pro;
	font-style: normal;
	font-weight: bold;
	font-size: 1.3rem;
	line-height: 1.75rem;
	color: #000000;
	margin-bottom: 0rem;
`;

const thisAnErrorCSS = css`
	font-family: Gilroy;
	font-size: 1rem;
	line-height: 1.125rem;
	color: #9b9b9b;
	margin-top: 0.5rem;
`;

const reportButtonCSS = css`
	background: #ffffff;
	border: 0.125rem solid #1c1c1c;
	box-sizing: border-box;
	border-radius: 0.25rem;
	width: 12rem;
	height: 2.5rem;
`;

const websiteHealthCSS = css`
	font-family: Gilroy;
	font-size: 1rem;
	line-height: 1.125rem;
	color: #424242;
	padding: 5rem;
	display: flex;
	align-items: baseline;
`;

const healthButtonCSS = css`
	background: #ffffff;
	border: 0.1rem solid #dcdcdc;
	box-sizing: border-box;
	border-radius: 0.5rem;
	margin: 1rem;
	width: 10rem;
	height: 2.25rem;
	display: flex;
	justify-content: space-between;
	padding: 0.5rem;
	align-items: center;
`;

const greenLightCSS = css`
	width: 0.625rem;
	height: 0.625rem;
	border: 0.0625rem solid #75ae2d;
	box-sizing: border-box;
	border-radius: 0.3125rem;
	background: #8ddf26;
`;

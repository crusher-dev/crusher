import { css } from "@emotion/core";
import notFoundSatellite from "../public/assets/img/illustration/not_found_satellite.png";

export default function Error404() {
	return (
		<div css={notFoundCSS}>
			<img src={notFoundSatellite} css={satelliteImageCSS} />
			<p css={pageUnreachableCSS}>This page is unreachable</p>
			<p css={thisAnErrorCSS}>
				If you think this is an error, we'll fix and create a test for it
			</p>

			<button css={reportButtonCSS}> Report Issue </button>
			{/* <div css={styles.websiteHealth}>
				<p>Current Website Health: </p>
				<button css={styles.healthButton}>
					<div css={styles.greenLight}></div>Up: 99.9%
				</button>
			</div> */}
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
	margin-top: 1rem;
	font-size: 1rem;
	line-height: 1.125rem;
	color: #9b9b9b;
	margin-top: 0.5rem;
`;

const reportButtonCSS = css`
	margin-top: 1.5rem;
	background: #ffffff;
	border: 0.125rem solid #1c1c1c;
	box-sizing: border-box;
	border-radius: 0.25rem;
	width: 12rem;
	height: 2.5rem;
`;
import { css } from "@emotion/core";
// import Image from "next/image";
import notFoundSatellite from "../public/assets/img/illustration/not_found_satellite.png";

const styles = {
	satelliteImage: css`
		width: 13.5rem;
		height: 13.5rem;
		left: 43.4rem;
		right: 11.8rem;
	`,
	notFound: css`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
	`,
	pageUnreachable: css`
		font-family: Cera Pro;
		font-style: normal;
		font-weight: bold;
		font-size: 1.3rem;
		line-height: 1.75rem;
		color: #000000;
		padding: 1rem;
	`,
	thisAnError: css`
		font-family: Gilroy;
		font-size: 0.9rem;
		line-height: 1.125rem;
		color: #9b9b9b;
		padding: 0.5rem;
	`,
	reportButton: css`
		background: #ffffff;
		border: 0.125rem solid #1c1c1c;
		box-sizing: border-box;
		border-radius: 0.25rem;
		width: 12rem;
		height: 2.5rem;
	`,
	websiteHealth: css`
		font-family: Gilroy;
		font-size: 1rem;
		line-height: 1.125rem;
		color: #424242;
		padding: 5rem;
		display: flex;
		align-items: baseline;
	`,
	healthButton: css`
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
	`,
	greenLight: css`
		width: 0.625rem;
		height: 0.625rem;
		border: 0.0625rem solid #75ae2d;
		box-sizing: border-box;
        border-radius: 0.3125rem;
        background: #8DDF26;
	`,
};

export default function error404() {
	return (
		<div css={styles.notFound}>
			<img src={notFoundSatellite} css={styles.satelliteImage} />
			<p css={styles.pageUnreachable}>This page is unreachable</p>
			<p css={styles.thisAnError}>
				If you think this is an error, we'll fix and create a test for it
			</p>

			<button css={styles.reportButton}> Report Issue </button>
			{/* <div css={styles.websiteHealth}>
				<p>Current Website Health: </p>
				<button css={styles.healthButton}>
					<div css={styles.greenLight}></div>Up: 99.9%
				</button>
			</div> */}
		</div>
	);
}

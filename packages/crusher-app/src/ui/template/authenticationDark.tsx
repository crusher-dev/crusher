import { css } from "@emotion/core";
import { WhiteLogo } from "@components/Atoms";
import React from "react";

export function AuthenticationDarkTemplate({ children }) {
	return (
		<div css={styles.templateContainer}>
			<div css={styles.backgroundLayer} />
			<div css={styles.logoContainer}>
				<WhiteLogo style={{ height: "1.9rem" }} />
			</div>
			{children}
		</div>
	);
}

const styles = {
	backgroundLayer: css`
		background-image: url("assets/img/background/dark.jpg");
		background-size: 110%;
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0;
		top: 0;
		z-index: -1;
	`,
	logoContainer: css`
		margin: 0 auto;
		margin-bottom: 2rem;
	`,
	templateContainer: css`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 3.5rem;
	`,
};

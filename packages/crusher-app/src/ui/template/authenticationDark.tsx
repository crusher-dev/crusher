import { css } from "@emotion/core";
import { Logo } from "@ui/components/common/Atoms";
import React, { useContext } from "react";
import { COMPONENTS, ThemeContext } from "@constants/style";
import { getStyleFromObject } from "@utils/styleUtils";

export function AuthenticationTemplate({ children }) {
	const theme = useContext(ThemeContext);
	return (
		<div css={styles.templateContainer}>
			<div css={styles.backgroundLayer(theme)} />
			<div css={styles.logoContainer}>
				<Logo style={{ height: "1.9rem" }} />
			</div>
			{children}
		</div>
	);
}

const styles = {
	backgroundLayer: (theme) => css`
		background-size: 110%;
		background-image: ${`url("/assets/img/background/${theme}_pattern.svg")`};
		background-color: ${getStyleFromObject(
			COMPONENTS.dashboard.background,
			theme,
		)};
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0;
		top: 0;
		z-index: -1;
	`,
	logoContainer: css`
		margin: 0 auto;
		// margin-bottom: 1rem;
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

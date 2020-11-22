import React from "react";
import { css } from "@emotion/core";

class BlackOverlay extends React.Component {
	render() {
		const { children } = this.props;

		return <div css={styles.container}>{children}</div>;
	}
}

const styles = {
	container: css`
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 199;
	`,
};

export { BlackOverlay };

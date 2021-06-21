import React, { CSSProperties } from "react";
import { css } from "@emotion/core";

interface ProgressBarProps {
	progress?: number;
	style?: CSSProperties;
}

function ProgressBar(props: ProgressBarProps) {
	const { progress, style } = props;

	return (
        <div css={styles.container} style={style}>
			<div css={styles.barIndicator} style={{ width: `${progress || 0}%` }}></div>
		</div>
    );
}

const styles = {
	container: css`
		padding: 0;
		overflow: hidden;
	`,
	barIndicator: css`
		background: linear-gradient(180deg, #3bf54e 0%, #53c81c 100%);
		border-radius: 4px 0px 0px 4px;
		height: 100%;
		transition: width 1s ease-in-out;
	`,
};

export { ProgressBar };

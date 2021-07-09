import React from "react";
import { css } from "@emotion/core";

function Label(props) {
	const { title, description, style } = props;

	return (
		<div css={styles.label} style={style}>
			<div css={styles.labelTitle}>{title}</div>
			<div css={styles.labelDescription}>{description}</div>
		</div>
	);
}

const styles = {
	label: css`
		flex: 1;
	`,
	labelTitle: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: bold;
		font-size: 1.1rem;
		color: #2d3958;
	`,
	labelDescription: css`
		font-family: DM Sans;
		font-style: normal;
		font-weight: normal;
		font-size: 1rem;
		margin-top: 0.3rem;
		color: #2d3958;
	`,
};

export default Label;

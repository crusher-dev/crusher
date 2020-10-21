import React from "react";
import { css } from "@emotion/core";
import Label from "./label";

function withLabel(props) {
	const { labelTitle, labelDescription, children, style, labelStyle } = props;

	return (
		<div css={styles.container} style={style}>
			<Label
				style={labelStyle}
				title={labelTitle}
				description={labelDescription}
			/>
			<div css={styles.inputContainer}>{children}</div>
		</div>
	);
}

const styles = {
	container: css`
		display: flex;
		&:not(:last-child) {
			margin-bottom: 1.75rem;
		}
	`,
	inputContainer: css`
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	`,
};
export default withLabel;

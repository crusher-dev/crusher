import React from "react";
import { css } from "@emotion/core";

function Form(props) {
	const { children, heading } = props;

	return (
		<div css={styles.container}>
			{heading && <div css={styles.headingContainer}>{heading}</div>}
			<div css={styles.formContainer(heading)}>{children}</div>
		</div>
	);
}

const styles = {
	container: css``,
	headingContainer: css`
		font-size: 1.1rem;
		font-weight: 600;
		font-style: solid;
	`,
	formContainer: function (heading) {
		if (!heading) {
			return css``;
		}

		return css`
			margin-top: 2rem;
		`;
	},
};

export default Form;

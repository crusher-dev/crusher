import React from "react";
import { css } from "@emotion/core";

export const DarkInput = (props) => {
	const { value, onChange, isInvalid } = props;
	return (
		<div>
			<input
				name="test_name"
				value={value}
				placeholder="Enter test name"
				onChange={onChange}
				css={[styles.input, isInvalid ? styles.invalidInput : null]}
			/>
		</div>
	);
};

const styles = {
	input: css`
		background: #1a1a1a;
		border-radius: 5px;
		margin-top: 40px;
		color: #ffffff;
		font-size: 16px;
		width: 100%;
		border: none;
		padding: 24px 28px;
		box-sizing: border-box;
	`,
	invalidInput: css`
		border-color: #c70000;
		border-width: 1px;
		border-style: solid;
	`,
};

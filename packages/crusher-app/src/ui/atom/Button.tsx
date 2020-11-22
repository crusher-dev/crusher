import React, { ReactElement } from "react";
import { css } from "@emotion/core";

/**
 * Current support only one style, blue and normal size
 * Future scope, Add size, icon, and type
 */

interface IProps {
	title: string; // Should be changed text/label
	onClick: () => void;
	disabled: boolean;
}

Button.defaultProps = {
	disabled: false,
	onClick: () => {},
};

function Button(props: IProps): ReactElement {
	const { title, onClick, disabled, ...otherProps } = props;
	return (
		<div
			css={[styles.button, disabled && styles.disabled]}
			onClick={onClick}
			{...otherProps}
		>
			{title}
		</div>
	);
}

const styles = {
	button: css`
		background: #5b76f7;
		border: 1px solid #2f4fe7;
		border-radius: 0.25rem;
		padding: 1rem 2.25rem;
		font-weight: 700;
		font-size: 0.825rem;
		line-height: 0.825rem;
		color: #fff;
		display: inline-block;
		cursor: pointer;
	`,
	disabled: css`
		background: #eeeeee;
		border: 1px solid #a6a6a6;
		color: #a6a6a6;
	`,
};

export default Button;

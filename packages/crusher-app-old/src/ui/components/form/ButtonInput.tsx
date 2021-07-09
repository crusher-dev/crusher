import React from "react";
import { css } from "@emotion/core";

function ButtonInput(props) {
	const { title, name, isSelected, onClick, style } = props;

	function onButtonClick() {
		if (onClick) {
			onClick(name);
		}
	}

	return (
		<div css={styles.button(isSelected)} onClick={onButtonClick} style={style}>
			{title}
		</div>
	);
}

const styles = {
	button: function (isSelected) {
		return css`
			border-radius: 0.35rem;
			padding: 0.55rem 4.5rem;
			font-family: DM Sans;
			border-color: ${isSelected ? "#35a510" : "#c7cacd"};
			color: ${isSelected ? "#35a510" : "#2d3958"};
			font-weight: ${isSelected ? "bold" : "normal"};
			border-style: solid;
			border-width: 1.2px;
			cursor: pointer;
			text-align: center;
			&:not(:last-child) {
				margin-right: 2.25rem;
			}
		`;
	},
};
export default ButtonInput;

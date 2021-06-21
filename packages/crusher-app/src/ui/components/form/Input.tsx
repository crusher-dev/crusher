import React from "react";
import { css } from "@emotion/core";

function Input(props) {
	const { name, value, onChange, width, height, style, placeholder } = props;
	return <input css={styles.input(width, height)} style={style} placeholder={placeholder} value={value} name={name} onChange={onChange} />;
}

const styles = {
	input: function (width, height) {
		return css`
			border: 1px solid #c7cacd;
			border-radius: 0.2rem;
			padding: 0.5rem 0;
			padding-left: 1.2rem;
			width: ${!!width || width === 0 ? width : "auto"};
			height: ${!!height || height === 0 ? height : "auto"};
			font-family: DM Sans;
			font-weight: 500;
			font-size: 0.9rem;
		`;
	},
};

export default Input;

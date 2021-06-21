import React from "react";
import { css } from "@emotion/core";

function TextArea(props) {
	const { placeholder, value, style, width, height, onChange } = props;

	return <textarea placeholder={placeholder} css={styles.textArea(width, height)} onChange={onChange} style={style} value={value} />;
}

const styles = {
	textArea: function (width, height) {
		return css`
			border: 1px solid #c7cacd;
			border-radius: 0.4rem;
			padding: 0.5rem 0;
			padding-left: 1.2rem;
			width: ${!!width || width === 0 ? width : "auto"};
			height: ${!!height || height === 0 ? height : "auto"};
			font-family: DM Sans;
			font-weight: 500;
			font-size: 0.9rem;
			overflow: auto;
			outline: none;

			-webkit-box-shadow: none;
			-moz-box-shadow: none;
			box-shadow: none;

			resize: none;
		`;
	},
};

export default TextArea;

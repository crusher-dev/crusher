import React from "react";
import { css } from "@emotion/core";

interface iProps {
	value: string;
	title: string;
	id: string;
	placeholder: string;
	customCSS: any;
	onChange: any;
}

const ModalInput = (props: iProps) => {
	const { id, placeholder, value, onChange, customCSS } = props;
	return (
		<div css={[containerCss, customCSS]}>
			<input id={id} onChange={onChange} placeholder={placeholder} value={value} css={containerCss}></input>
		</div>
	);
};

const containerCss = css`
	label {
		font-family: Gilroy;
		font-weight: bold;
		color: #2b2b39;
		font-size: 1rem;
		line-height: 1rem;
	}
	input {
		padding: 0.5rem 1rem;
		font-family: Gilroy;
		font-size: 1rem;
		color: #2e2e2e;
		border: 0.125rem solid #dfdfdf;
		width: 100%;

		border-radius: 0.25rem;
	}
`;

export { ModalInput };

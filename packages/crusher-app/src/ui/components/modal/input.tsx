import React from "react";
import { css } from "@emotion/core";

interface iProps {
	value: string;
	title: string;
	id: string;
	placeholder: string;
	css: any;
	onChange: (newValue: string) => void;
}

const ModalInput = (props: any) => {
	const {id, title, placeholder, value, onChange, css} = props;
	return (
		<div css={[containerCss, css]}>
			<div><label htmlFor={id}>{title}</label></div>
			<input id={id} onChange={onChange} placeholder={placeholder} value={value} css={containerCss}></input>
		</div>
	);
};

const containerCss = css`
	label {
		font-family: Gilroy;
		font-weight: bold;
		color: #2B2B39;
		font-size: 0.825rem;
	}
	input {
		margin-top: 0.65rem;
		padding: 0.65rem 0.9rem;
		font-family: Gilroy;
		font-size: 0.8rem;
		color: #2E2E2E;
		border: 0.1rem solid #DFDFDF;
		width: 100%;
		border-radius: 0.25rem;
	}
`;

export { ModalInput };

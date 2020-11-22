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
	const { id, title, placeholder, value, onChange, css } = props;
	return (
		<div css={[containerCss, css]}>
			<div>
				<label htmlFor={id}>{title}</label>
			</div>
			<input
				id={id}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
				css={containerCss}
			></input>
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
		margin-top: 0.8rem;
		padding: 0.7rem 1rem;
		font-family: Gilroy;
		font-size: 1rem;

		color: #2e2e2e;
		border: 0.125rem solid #dfdfdf;
		width: 100%;
		border-radius: 0.25rem;
	}
`;

export { ModalInput };

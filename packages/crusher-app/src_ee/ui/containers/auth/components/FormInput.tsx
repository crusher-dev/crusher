import { css } from "@emotion/react";

import { Input } from "dyson/src/components/atoms";

import { newInputBoxCSS } from "../login";

/*
	@Note - Wrong implementation of the loading state.
						It should be implemented in the parent component.
 */
export function FormInput({ type, hidden, data, onChange, placeholder, autoComplete, onBlur, onKeyDown, onReturn, className }: any) {
	return (
		<div css={hidden ? css`display: none;` : undefined}>
			<Input
				className={`${className} md-20 bg`}
				autoComplete={autoComplete}
				value={data.value}
				placeholder={placeholder}
				onChange={onChange}
				isError={data.error}
				onKeyDown={onKeyDown}
				onReturn={onReturn}
				onBlur={onBlur}
				type={type || "text"}
				css={newInputBoxCSS}
			/>
			<div className={"mt-4 mb-5 text-11"} css={errorState}>
				{data.error}
			</div>
		</div>
	);
}

export const errorState = css(`
	color: #ff4583;
	height: 12rem;
	width: 100%;
`);

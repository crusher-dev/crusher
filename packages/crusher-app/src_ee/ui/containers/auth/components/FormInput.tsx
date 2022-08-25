import { Input } from "dyson/src/components/atoms";
import { css } from "@emotion/react";

/*
	@Note - Wrong implementation of the loading state.
						It should be implemented in the parent component.
 */
export function FormInput({ type, data, onChange, placeholder, autoComplete, onBlur, onKeyDown, onReturn, className }: any) {
	return (
		<div>
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

import { Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { getBoolean } from "@utils/common";
import { errorState } from "../signup";

export function TextBox({ data, onChange, placeholder, autoComplete, onBlur, onKeyDown }: {}) {
	return (
		<div className="mt-20">
			<Input
				className="md-20 bg"
				autoComplete={autoComplete}
				value={data.value}
				placeholder={placeholder}
				onChange={onChange}
				isError={data.error}
				onKeyDown={onKeyDown}
				onBlur={onBlur}
			/>
			<Conditional showIf={getBoolean(data.error)}>
				<div className={"mt-8 text-12"} css={errorState}>
					{data.error}
				</div>
			</Conditional>
		</div>
	);
}

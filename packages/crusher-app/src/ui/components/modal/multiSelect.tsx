import React from "react";
import Select from "react-select";
import { css } from "@emotion/core";

interface iProps {
	className: string;
	name: string;
	title: string;
	values: any[];
	options: any[];
	css: any;
	style: any;
	onChange: any;
}

const MultiSelect = (props: iProps) => {
	const { className, title, name, options, values, css, onChange, style } = props;

	return (
		<div css={[containerCss, css]} style={style}>
			<div style={{ marginBottom: "0.75rem" }}>
				<label>{title}</label>
			</div>
			<Select value={values} isMulti onChange={onChange} name={name} className={className} options={options} />
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
`;

export { MultiSelect };

import React from "react";
import ReactSelect from "react-select";

export const Select = (props) => {
	const { onChange, options, placeholder } = props;
	return (
		<ReactSelect
			options={options}
			onChange={onChange}
			placeholder={placeholder}
		/>
	);
};

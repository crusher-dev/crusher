import React from "react";
import ReactSelect from "react-select";

export const Select = (props) => {
	const { onChange, options, placeholder } = props;
	return (
		<ReactSelect
			styles={{
				menu: (provided, state) => ({ ...provided, backgroundColor: "#1A1A1A" }),
				control: (provided, state) => ({
					...provided,
					backgroundColor: "#1A1A1A",
					border: "none",
					outline: "none",
					padding: "8px 12px",
					marginTop: "24px",
				}),
				singleValue: (provided, state) => {
					const opacity = state.isDisabled ? 0.7 : 1;
					return { ...provided, opacity, color: "#fff" };
				},
				option: (provided, state) => {
					return {
						...provided,
						color: state.isSelected ? "#fff" : "#fff",
						backgroundColor: "#1A1A1A",
					};
				},
			}}
			options={options}
			onChange={onChange}
			placeholder={placeholder}
		/>
	);
};

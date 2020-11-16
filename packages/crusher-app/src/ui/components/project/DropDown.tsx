import Select from "react-select";

import React from "react";

export function DropDown(props) {
	let {
		options,
		selected,
		onChange,
		placeholder,
		width,
		heightFactor,
		isSearchable,
		isMulti,
	} = props;

	width = width ? width : "18rem";
	let paddingTop = heightFactor ? `${heightFactor * 0.3}rem` : "0.3rem";

	const dropdownStyle = {
		menu: (provided, state) => ({
			...provided,
			backgroundColor: "#fff",
			width: width,
			zIndex: 200000000,
		}),
		control: (provided, state) => ({
			...provided,
			backgroundColor: "#fff",
			border: "1px solid #E9E9E9",
			outline: "none",
			zIndex: 1000,
			padding: `${paddingTop} 12px`,
			borderRadius: "0.375rem",
			paddingRight: "0.25rem",
			width: width,
		}),
		container: (provided, state) => ({
			position: "relative",
			width: "100%",
		}),
		singleValue: (provided, state) => {
			return { ...provided, color: "#2D3958", fontSize: "1rem" };
		},
		option: (provided, state) => {
			return {
				...provided,
				color: state.isSelected ? "#2D3958" : "#2D3958",
				backgroundColor: "#f2f2f2",
			};
		},
	};

	if (isMulti) {
		return (
			<Select
				styles={dropdownStyle}
				placeholder={placeholder}
				options={options}
				onChange={onChange}
				isSearchable={isSearchable}
				isMulti={isMulti}
			/>
		);
	}

	return (
		<Select
			styles={dropdownStyle}
			placeholder={placeholder}
			options={options}
			onChange={onChange}
			isSearchable={isSearchable}
			value={options.filter(
				(option) => selected && option.value == selected.value,
			)}
		/>
	);
}

import Select from "react-select";

import React from "react";

/*
	@Note - Don't use this component this is not standardised.
*/
export function DropDown(props) {
    let { options, selected, onChange, placeholder, width, heightFactor, isSearchable, isMulti } = props;

    if (!width)
        width = "17rem";
    const paddingTop = heightFactor ? `${heightFactor * 0.3}rem` : "0.1rem";

    const dropdownStyle = {
		menu: (provided) => ({
			...provided,
			backgroundColor: "#fff",
			width: width,
			zIndex: 200000000,
		}),
		control: (provided) => ({
			...provided,
			backgroundColor: "#fff",
			border: "1px solid #d1d1d1",
			outline: "none",
			zIndex: 1000,
			padding: `${paddingTop} .75rem`,
			borderRadius: "0.275rem",
			paddingRight: "0.25rem",
			width: width,
		}),
		container: () => ({
			position: "relative",
			width: "100%",
		}),
		singleValue: (provided) => {
			return { ...provided, color: "#2D3958", fontSize: "1rem" };
		},
		option: (provided, state) => {
			const {
                value
            } = state.data;
			let additionalStyle = {};

			if (value === "add_project") {
				additionalStyle = {
					color: "#6583FE",
					textDecoration: "underline",
					fontWeight: 600,
				};
			}

			return {
				...provided,
				color: '#18181A',
				backgroundColor: state.isSelected ? "#F8F8F8" : "#fff",
				cursor: "pointer",
				...additionalStyle,
			};
		},
	};

    if (isMulti) {
		return <Select styles={dropdownStyle} placeholder={placeholder} options={options} onChange={onChange} isSearchable={isSearchable} isMulti={isMulti} />;
	}

    return (
        <Select
			styles={dropdownStyle}
			placeholder={placeholder}
			options={options}
			onChange={onChange}
			isSearchable={isSearchable}
			value={options.filter((option) => selected && option.value === selected.value)}
		/>
    );
}

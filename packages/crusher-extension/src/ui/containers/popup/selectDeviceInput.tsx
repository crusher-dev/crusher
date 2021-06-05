import React, { useMemo } from "react";
import devices from "../../../../../crusher-shared/constants/devices";
import Select from "react-select";

interface iRenderDeviceInputProps {
	selectedDevice: any;
	selectDevice: (deviceId: string) => void;
}

const SelectDeviceInput = (props: iRenderDeviceInputProps) => {
	const { selectedDevice, selectDevice } = props;

	let deviceOptions = useMemo(() => {
		return devices.map((device) => ({
			label: device.name,
			value: device.id,
		}));
	}, [devices]);

	const selectedDeviceOption = deviceOptions.find((device) => {
		return device.value === selectedDevice;
	});

	const handleDeviceSelected = (selectedOption: any) => {
		selectDevice(selectedOption.value);
	};

	return (
		<div style={selectInputContainerStyle} className="select">
			<Select
				options={deviceOptions}
				value={selectedDeviceOption}
				onChange={handleDeviceSelected}
				styles={dropdownStyle as any}
				placeholder={"Please select some device"}
			></Select>
		</div>
	);
};

const dropdownStyle = {
	menu: (provided: any) => ({
		...provided,
		backgroundColor: "#fff",
		width: "100%",
		zIndex: 200000000,
	}),
	control: (provided: any) => ({
		...provided,
		backgroundColor: "#fff",
		border: "1px solid #d1d1d1",
		outline: "none",
		zIndex: 1000,
		padding: `0.25rem .75rem`,
		borderRadius: "0.225rem",
		paddingRight: "0.25rem",
	}),
	container: () => ({
		position: "relative",
		width: "100%",
	}),
	singleValue: (provided: any) => {
		return { ...provided, color: "#2D3958", fontSize: "0.85rem" };
	},
	option: (provided: any, state: any) => {
		const value = state.data.value;
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
			color: state.isSelected ? "#18181A" : "#18181A",
			backgroundColor: state.isSelected ? "#F8F8F8" : "#fff",
			cursor: "pointer",
			...additionalStyle,
		};
	},
};

const selectInputContainerStyle = {
	borderRadius: "0.2rem",
	width: "100%",
	minWidth: "14rem",
	fontWeight: 500,
	fontFamily: "DM Sans",
	// color: "#fff",
	fontSize: "1rem",
	borderWidth: 0,
};

export { SelectDeviceInput };

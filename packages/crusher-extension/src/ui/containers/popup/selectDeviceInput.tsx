import React, { useMemo } from 'react';
import devices from "../../../../../crusher-shared/constants/devices";
import Select from "react-select";
import { COLOR_CONSTANTS } from "../../../ui/colorConstants";
import { pxToRemValue } from "../../../utils/helpers";

interface iRenderDeviceInputProps {
	selectedDevice: any;
	selectDevice: (deviceId: string) => void;
}


const SelectDeviceInput = (props: iRenderDeviceInputProps) => {
	const { selectedDevice, selectDevice } = props;

	let deviceOptions = useMemo(() => {
		return devices.map((device) => ({
			label: device.name,
			value: device.id
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
			>
			</Select>
		</div>
	);
};

const dropdownStyle = {
	menu: (provided: any) => ({
		...provided,
		backgroundColor: `${COLOR_CONSTANTS.SECONDARY}`,
		zIndex: 20000
	}),
	control: (provided: any) => ({
		...provided,
		background: "transparent",
		border: `1px solid ${COLOR_CONSTANTS.BUTTON_BORDER_COLOR}`,
		outline: "none",
		zIndex: 1000,
		borderRadius: "0.425rem",
		paddingRight: "0.25rem",
	}),
	container: () => ({
		position: "relative",
		width: "100%",
	}),
	singleValue: (provided: any) => {
		return {
			...provided,
			color: COLOR_CONSTANTS.TEXT_LIGHT,
			fontSize: pxToRemValue(13),
		};
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
			color: state.isSelected ? "white" : COLOR_CONSTANTS.TEXT_LIGHT,
			backgroundColor: state.isSelected
				? COLOR_CONSTANTS.PRIMARY
				: COLOR_CONSTANTS.TRINARY,
			cursor: "pointer",
			...additionalStyle,
		};
	},
};

const selectInputContainerStyle = {
	borderRadius: "0.4rem",
	minWidth: "12rem",
	fontWeight: 500,
	fontFamily: "DM Sans",
	fontSize: pxToRemValue(13),
	borderWidth: 0,
};

export { SelectDeviceInput };

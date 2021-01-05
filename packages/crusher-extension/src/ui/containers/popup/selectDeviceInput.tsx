import React from "react";
import devices from "../../../../../crusher-shared/constants/devices";

interface iRenderDeviceInputProps {
	selectedDevice: any;
	selectDevice: (deviceId: string) => void;
}

const SelectDeviceInput = (props: iRenderDeviceInputProps) => {
	const { selectedDevice, selectDevice } = props;

	const deviceOptions = devices.map((device) => (
		<option key={device.id} value={device.id}>
			{device.name}
		</option>
	));

	const handleDeviceSelected = (event: any) => {
		const newDeviceId = event.target.value;
		selectDevice(newDeviceId);
	};

	return (
		<div style={selectInputContainerStyle} className="select">
			<select
				size={1}
				value={selectedDevice}
				style={selectBoxStyle}
				onChange={handleDeviceSelected}
			>
				<option selected disabled>
					Select Device Type
				</option>
				{deviceOptions}
			</select>
		</div>
	);
};

const selectInputContainerStyle = {
	borderRadius: "0.2rem",
	marginTop: "1rem",
	width: "100%",
	fontWeight: 500,
	fontFamily: "DM Sans",
	color: "#fff",
	fontSize: "1rem",
	borderWidth: 0,
};

const selectBoxStyle = {
	borderRadius: "0.2rem",
	width: "100%",
	padding: ".75rem",
};

export { SelectDeviceInput };

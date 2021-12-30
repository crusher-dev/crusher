import { iDevice } from "../types/extension/device";

const devices: Array<iDevice> = [
	{
		id: "Pixel33XL",
		name: "Mobile",
		width: 393,
		height: 786,
		visible: true,
		mobile: true,
		userAgent: "Google Pixel",
	},
	{
		id: "GoogleChromeMediumScreen",
		name: "Desktop M",
		width: 1280,
		height: 800,
		visible: true,
		userAgent: "Google Chrome",
	},
	{
		id: "GoogleChromeLargeScreenL",
		name: "Desktop L",
		width: 1440,
		height: 800,
		visible: true,
		userAgent: "Google Chrome",
	},
];

export default devices;

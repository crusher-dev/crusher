enum TDeviceEnum {
	PIXEL = "Pixel33XL",
	DESKTOP_M = "GoogleChromeMediumScreen",
	DESKTOP_L = "GoogleChromeLargeScreenL",
}

interface iDevice {
	id: TDeviceEnum;
	name: string;
	width: number;
	height: number;
	mobile: boolean;
	visible: boolean;
	/* @Note: Refractor Legacy implementation */
	userAgent: string;
	userAgentRaw: string;
}

const devices: iDevice[] = [
	{
		id: TDeviceEnum.DESKTOP_M,
		name: "Desktop",
		width: 1280,
		height: 800,
		mobile: false,
		visible: true,
		userAgent: "Google Chrome",
		userAgentRaw: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
	},
	{
		id: TDeviceEnum.DESKTOP_L,
		name: "Desktop L",
		width: 1440,
		height: 800,
		mobile: false,
		visible: false,
		userAgent: "Google Chrome",
		userAgentRaw: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
	},
	{
		id: TDeviceEnum.PIXEL,
		name: "Mobile",
		width: 393,
		height: 786,
		mobile: true,
		visible: true,
		userAgent: "Google Pixel",
		userAgentRaw: "Mozilla/5.0 (Linux; Android 7.1.1; Pixel Build/NOF27B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.132 Mobile Safari/537.36",
	},
];

function getDeviceFromId(id: TDeviceEnum | string) {
	return devices.find((device) => device.id === id);
}

export { TDeviceEnum, iDevice, devices, getDeviceFromId };

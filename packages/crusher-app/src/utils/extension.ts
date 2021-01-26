// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DEVICE_TYPES } from "@crusher-shared/types/deviceTypes";
import devices from "@crusher-shared/constants/devices";
import { iDevice } from "@crusher-shared/types/extension/device";

const Chrome = typeof chrome !== "undefined" ? (chrome as any) : null;

const getChromeExtensionId = (): string => {
	return process.env.NEXT_PUBLIC_EXTENSION_ID
		? process.env.NEXT_PUBLIC_EXTENSION_ID
		: "fdbnpjonlhmjhjfojacolckkbipcecoe";
};

const checkIfExtensionPresent = (): Promise<boolean> => {
	return new Promise((resolve) => {
		Chrome.runtime.sendMessage(
			getChromeExtensionId(),
			{ message: "version" },
			function (reply: any) {
				if (reply && reply.version) {
					resolve(true);
				} else {
					resolve(false);
				}
			},
		);
	});
};

const getDefaultDeviceFromDeviceType = (type: DEVICE_TYPES): iDevice | null => {
	if (type === DEVICE_TYPES.DESKTOP) {
		return devices[8];
	} else if (type === DEVICE_TYPES.MOBILE) {
		return devices[5];
	} else {
		return null;
	}
};

export {
	getChromeExtensionId,
	getDefaultDeviceFromDeviceType,
	checkIfExtensionPresent,
};

import { iAction } from "@crusher-shared/types/action";
import { Browser, BrowserContextOptions, Page } from "playwright";
import { iDevice } from "@crusher-shared/types/extension/device";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { getUserAgentFromName, userAgents } from "@crusher-shared/constants/userAgents";

async function setDevice(browser: Browser, action: iAction, globals: IGlobalManager) {
	const device: { width: number; height: number } = action.payload.meta.device as iDevice;
	const userAgent = getUserAgentFromName(action.payload.meta.device.userAgent);

	const currentBrowserContextOptions = globals.get("browserContextOptions");

	if (currentBrowserContextOptions && currentBrowserContextOptions.recordVideo) {
		currentBrowserContextOptions.recordVideo = {
			...currentBrowserContextOptions.recordVideo,
			size: { width: device.width, height: device.height },
		};
	}

	console.log("Setting this user agent", userAgent.value);

	globals.set("browserContextOptions", {
		...currentBrowserContextOptions,
		userAgent: userAgent ? userAgent.value : userAgents[0].value,
		viewport: {
			width: device.width,
			height: device.height,
		},
	});

	return {
		customLogMessage: "Finished setting up device",
		meta: {
			width: device.width,
			height: device.height,
			userAgent: userAgent,
		},
	};
}

module.exports = {
	name: ActionsInTestEnum.SET_DEVICE,
	description: "Configuration of device config",
	actionDescriber: (action: iAction) => {
		const device: { width: number; height: number; name: string } = action.payload.meta.device as iDevice;

		return `Set device ${device && device.name ? `to [${device.name}]` : ""}`;
	},
	handler: setDevice,
};

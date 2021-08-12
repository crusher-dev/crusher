
import { iAction } from "@crusher-shared/types/action";
import { Browser, BrowserContextOptions, Page } from "playwright";
import { iDevice } from "@crusher-shared/types/extension/device";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";

async function setDevice(browser: Browser, action: iAction, globals: IGlobalManager) {
	const device: { width: number, height: number } = action.payload.meta.device as iDevice;
	const userAgent = action.payload.meta.userAgent && action.payload.meta.userAgent.value ? action.payload.meta.userAgent.value : action.payload.meta.userAgent;

	const currentBrowserContextOptions = globals.get("browserContextOptions");

	globals.set("browserContextOptions", {
		...currentBrowserContextOptions,
		userAgent: userAgent,
		viewport: {
			width: device.width,
			height: device.height,
		}
	});

	return {
		customLogMessage: "Finished setting up device",
		meta: {
			width: device.width,
			height: device.height,
			userAgent: userAgent,
		}
	}
}

module.exports = {
		name: ActionsInTestEnum.SET_DEVICE,
    description: "Configuration of device config",
    handler: setDevice,
}
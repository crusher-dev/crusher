
import { iAction } from "@crusher-shared/types/action";
import { Browser, BrowserContextOptions, Page } from "playwright";
import { iDevice } from "@crusher-shared/types/extension/device";
import { GlobalManager } from "src/globals";

async function setDevice(browser: Browser, action: iAction, globals: GlobalManager) {
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
    name: "BROWSER_SET_DEVICE",
    description: "Configuration of device config",
    handler: setDevice,
}
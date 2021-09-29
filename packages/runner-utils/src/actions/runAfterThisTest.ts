import { iAction } from "@crusher-shared/types/action";
import { Browser, BrowserContextOptions, Page } from "playwright";
import { iDevice } from "@crusher-shared/types/extension/device";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { getUserAgentFromName, userAgents } from "@crusher-shared/constants/userAgents";

async function setupRunAfterTest(browser: Browser, action: iAction, globals: IGlobalManager) {
	const storageState = action.payload.meta.storageState;
	if (!storageState) throw new Error("No storage state specified to start from");

	const currentBrowserContextOptions = globals.get("browserContextOptions");

	globals.set("browserContextOptions", {
		...currentBrowserContextOptions,
		storageState: storageState
	});

	return {
		customLogMessage: "Finished setting up storage state",
    meta: {
      storageState: storageState
		},
	};
}

module.exports = {
	name: ActionsInTestEnum.RUN_AFTER_TEST,
	description: "Start test from specified storage state",
	handler: setupRunAfterTest,
};

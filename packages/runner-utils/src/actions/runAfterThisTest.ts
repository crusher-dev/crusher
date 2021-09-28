import { iAction } from "@crusher-shared/types/action";
import { Browser, BrowserContextOptions, Page } from "playwright";
import { iDevice } from "@crusher-shared/types/extension/device";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { getUserAgentFromName, userAgents } from "@crusher-shared/constants/userAgents";

async function setupRunAfterTest(browser: Browser, action: iAction, globals: IGlobalManager) {
	return {
		customLogMessage: "Finished setting up browser context",
    meta: {
      success: true
		},
	};
}

module.exports = {
	name: ActionsInTestEnum.RUN_AFTER_TEST,
	description: "Start test from specified context",
	handler: setupRunAfterTest,
};

import { iAction } from "@crusher-shared/types/action";
import { Browser, BrowserContextOptions, Page } from "playwright";
import { iDevice } from "@crusher-shared/types/extension/device";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { getUserAgentFromName, userAgents } from "@crusher-shared/constants/userAgents";

function transformStorageState(storageState: any) {
	if (!storageState) return storageState;

	const cookies = storageState.cookies
		? storageState.cookies.map((cookie) => {
				return cookie;
		  })
		: undefined;

	return {
		...storageState,
		cookies: cookies,
	};
}
async function setupRunAfterTest(browser: Browser, action: iAction, globals: IGlobalManager) {
	const storageState = action.payload.meta ? action.payload.meta.storageState : null;
	if (!storageState) throw new Error("No storage state specified to start from");

	const currentBrowserContextOptions = globals.get("browserContextOptions");

	console.log("Cookie", transformStorageState(storageState));

	globals.set("browserContextOptions", {
		...currentBrowserContextOptions,
		storageState: transformStorageState(storageState),
	});

	return {
		customLogMessage: "Finished setting up storage state",
		meta: {
			storageState: transformStorageState(storageState),
		},
	};
}

module.exports = {
	name: ActionsInTestEnum.RUN_AFTER_TEST,
	description: "Start test from specified storage state",
	actionDescriber: (action: iAction) => {
		return `Run after test`;
	},
	handler: setupRunAfterTest,
};

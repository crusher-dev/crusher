import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { ExportsManager } from "@functions/exports";
import { CrusherSdk } from "@sdk/sdk";
import { sleep } from "@functions/sleep";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import template from "@crusher-shared/utils/templateString";
import { CommunicationChannel } from "@functions/communicationChannel";

async function waitForNavigation(
	page: Page,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	communicationChannel: CommunicationChannel,
	sdk: CrusherSdk | null,
	context: any,
) {
	if (action.payload.meta?.value) {
		let url = template(action.payload.meta?.value, { ctx: context || {} });

		await page.waitForURL(url, { timeout: action.payload.meta?.timeout || 30000 });
	} else {
		await sleep(2000);
	}
	console.log("Finished navigation");
}

module.exports = {
	name: ActionsInTestEnum.WAIT_FOR_NAVIGATION,
	description: "Wait for navigation",
	actionDescriber: (action: iAction) => {
		return `Wait for navigation to [${action.payload.meta?.value}]`;
	},
	handler: waitForNavigation,
};

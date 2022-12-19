import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { CrusherSdk } from "@sdk/sdk";
import { ExportsManager } from "@functions/exports";
import template from "@crusher-shared/utils/templateString";
import { CommunicationChannel } from "@functions/communicationChannel";

async function goToUrl(
	page: Page,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	communicationChannel: CommunicationChannel,
	sdk: CrusherSdk | null,
	context: any,
	browser,
	runActions,
	isUsingProxy,
) {
	const urlToGo = template(action.payload.meta.value, { ctx: context || {} });
	try {
		await page.goto(urlToGo, { waitUntil: "load", timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined });
	} catch (ex) {
		const regex = new RegExp(/Timeout [\d]*ms exceeded/g);
		if(ex.message.match(regex)) {
			console.log("Got error during navigation", ex);
		} else {
			console.log("Got error during navigation", ex);
			throw ex;
		}
	}
}

module.exports = {
	name: ActionsInTestEnum.NAVIGATE_URL,
	description: "Navigation to url",
	actionDescriber: (action: iAction) => {
		return `Navigate to [${action.payload.meta.value}]`;
	},
	handler: goToUrl,
};

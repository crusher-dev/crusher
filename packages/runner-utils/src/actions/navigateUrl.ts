import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { CrusherSdk } from "../sdk/sdk";
import { ExportsManager } from "../functions/exports";
import template from "@crusher-shared/utils/templateString";
import { CommunicationChannel } from "../functions/communicationChannel";

async function goToUrl(page: Page, action: iAction, globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	communicationChannel: CommunicationChannel,
	sdk: CrusherSdk | null,
	context: any) {
	console.log("Context is this", context);
	const urlToGo = template(action.payload.meta.value, {ctx: context || {}});
	try {
		await page.goto(urlToGo, { waitUntil: "load", timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined });
	} catch (ex) { console.log("Got error during navigation", ex); }
}

module.exports = {
	name: ActionsInTestEnum.NAVIGATE_URL,
	description: "Navigation to url",
	handler: goToUrl,
};

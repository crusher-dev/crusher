import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";

async function goBack(page: Page, action: iAction) {
	try {
		await page.goBack({ waitUntil: "networkidle", timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined });
		await page.waitForLoadState("load");
		await page.waitForLoadState("domcontentloaded");
	} catch (ex) {
		console.log("Got error during navigation", ex);
	}
}

module.exports = {
	name: ActionsInTestEnum.BACK_PAGE,
	description: "Go back page",
	actionDescriber: (action: iAction) => {
		return `Go back page`;
	},
	handler: goBack,
};

import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";

async function goToUrl(page: Page, action: iAction) {
	const urlToGo = action.payload.meta.value;
	try {
		await page.goto(urlToGo, { timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined });
	} catch (ex) {
		console.log("Got error during navigation", ex);
	}
}

module.exports = {
	name: ActionsInTestEnum.NAVIGATE_URL,
	description: "Navigation to url",
	handler: goToUrl,
};

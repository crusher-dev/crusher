import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";

async function waitForNavigation(page: Page, action: iAction) {
	console.log("Waiting for navigation now...");
	try {
		await page.waitForNavigation();
		await page.waitForLoadState("networkidle");
		await page.waitForLoadState("load");
		await page.waitForLoadState("domcontentloaded");
	} catch (ex) { console.error("Gt error here", ex); }
	console.log("Finsihed navigation");
}

module.exports = {
	name: ActionsInTestEnum.WAIT_FOR_NAVIGATION,
	description: "Wait for navigation",
	handler: waitForNavigation,
};

import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";

async function waitForNavigation(page: Page, action: iAction) {
	try {
		await page.waitForLoadState("networkidle");
		await page.waitForLoadState("load");
		await page.waitForLoadState("domcontentloaded");
	} catch (ex) { throw ex; }
}

module.exports = {
	name: ActionsInTestEnum.WAIT_FOR_NAVIGATION,
	description: "Wait for navigation",
	handler: waitForNavigation,
};

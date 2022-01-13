import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { sleep } from "../functions/sleep";

async function waitForNavigation(page: Page, action: iAction) {
	console.log("Waiting for navigation now...");
	try {
		await sleep(5); // @TODO: Add a magic number here
		await page.waitForLoadState("load");
		await page.waitForLoadState("domcontentloaded");
	} catch (ex) {
		console.error("Gt error here", ex);
		await sleep(2); // Magic number
	}
	console.log("Finsihed navigation");
}

module.exports = {
	name: ActionsInTestEnum.WAIT_FOR_NAVIGATION,
	description: "Wait for navigation",
	handler: waitForNavigation,
};

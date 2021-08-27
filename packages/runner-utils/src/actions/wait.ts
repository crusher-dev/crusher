import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";

async function waitForSeconds(page: Page, action: iAction) {
	const timeout = action.payload.timeout;
    if(!timeout) return;
	await page.waitForTimeout(timeout * 1000);
	return;
}

module.exports = {
	name: ActionsInTestEnum.WAIT,
	description: "Wait for seconds",
	handler: waitForSeconds,
};

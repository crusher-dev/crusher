import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";

async function goToUrl(page: Page, action: iAction) {
	const urlToGo = action.payload.meta.value;
	await page.goto(urlToGo);
}

module.exports = {
	name: ActionsInTestEnum.NAVIGATE_URL,
	description: "Navigation to url",
	handler: goToUrl,
};

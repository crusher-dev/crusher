import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";

async function clickOnElement(element: Locator, workingSelector: any, action: iAction) {
	try {
		await element.click({ force: true, timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined });
	} catch (e) {
		if (!e.message.includes("selector resolved to hidden")) throw e;

		await element.dispatchEvent("click");
	}
}

module.exports = {
	name: ActionsInTestEnum.CLICK,
	description: "Click on element",
	handler: clickOnElement,
};

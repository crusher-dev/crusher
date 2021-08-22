import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";

async function clickOnElement(element: Locator) {
	try {
		await element.click({ force: true, timeout: 5000 });
	} catch (e) {
		if (!e.message.includes("selector resolved to hidden"))
			throw e;

		await element.dispatchEvent("click");
	}
}

module.exports = {
	name: ActionsInTestEnum.CLICK,
	description: "Click on element",
	handler: clickOnElement,
};

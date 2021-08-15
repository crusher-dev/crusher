import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";

async function clickOnElement(element: Locator) {
	await element.hover();
	await element.scrollIntoViewIfNeeded();
	await element.dispatchEvent("click");
}

module.exports = {
	name: ActionsInTestEnum.CLICK,
	description: "Click on element",
	handler: clickOnElement,
};

import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";

async function clickOnElement(element: Locator) {
	const el = (await element.elementHandles())[0];

	await el.scrollIntoViewIfNeeded();
	await el.hover();
	await el.dispatchEvent("click");
}

module.exports = {
	name: ActionsInTestEnum.CLICK,
	description: "Click on element",
	handler: clickOnElement,
};

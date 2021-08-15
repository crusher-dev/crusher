import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";

async function hoverOnElement(element: Locator) {
	await element.scrollIntoViewIfNeeded();
	await element.hover({ force: true });
}

module.exports = {
	name: ActionsInTestEnum.HOVER,
	description: "Hover on element",
	handler: hoverOnElement,
};

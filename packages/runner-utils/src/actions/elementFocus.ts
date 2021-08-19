import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";

export async function focusOnElement(element: Locator, workingSelector: any, step: iAction) {
	await element.focus();
}

module.exports = {
	name: ActionsInTestEnum.ELEMENT_FOCUS,
	description: "Focus on element",
	handler: focusOnElement,
};

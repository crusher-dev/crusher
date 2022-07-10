import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";

export async function focusOnElement(element: Locator, workingSelector: any, action: iAction) {
	await element.focus({ timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined });
}

module.exports = {
	name: ActionsInTestEnum.ELEMENT_FOCUS,
	description: "Focus on element",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Focus on element`;
		}
		return `Focus on [${action.payload.meta.elementDescription}]`;
	},
	handler: focusOnElement,
};

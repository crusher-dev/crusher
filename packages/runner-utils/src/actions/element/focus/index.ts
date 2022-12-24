import { Locator } from "playwright";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { ElementActionParams } from "@interfaces/actions";

export async function focusOnElement(params: ElementActionParams) {
	const { element } = params.playwright;
	const { currentStep } = params.test;

	await element.focus({ timeout: currentStep.payload.timeout ? currentStep.payload.timeout * 1000 : undefined });
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

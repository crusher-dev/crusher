import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { ElementActionParams } from "@interfaces/actions";
import { Locator } from "playwright";

async function hoverOnElement(params: ElementActionParams) {
	const { element } = params.playwright;
	const { currentStep } = params.test;

	await element.hover({ timeout: currentStep.payload.timeout ? currentStep.payload.timeout * 1000 : 5000 });
}

module.exports = {
	name: ActionsInTestEnum.HOVER,
	description: "Hover on element",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Hover on element`;
		}
		return `Hover on [${action.payload.meta.elementDescription}]`;
	},
	handler: hoverOnElement,
};

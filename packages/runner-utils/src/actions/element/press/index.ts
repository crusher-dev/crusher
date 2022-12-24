import { iAction } from "@crusher-shared/types/action";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import template from "@crusher-shared/utils/templateString";
import { ElementActionParams } from "@interfaces/actions";

async function pressKey(params: ElementActionParams) {
	const { element } = params.playwright;
	const { currentStep, context } = params.test;

	const keyToBePressed = template(currentStep.payload.meta.value, { ctx: context || {} });
	await element.press(keyToBePressed);
}

module.exports = {
	name: ActionsInTestEnum.PRESS,
	description: "Press key to element",
	actionDescriber: (action: iAction) => {
		return `Press ${action.payload.meta.value}`;
	},
	handler: pressKey,
};

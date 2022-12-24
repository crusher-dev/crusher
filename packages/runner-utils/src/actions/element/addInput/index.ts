import { iAction } from "@crusher-shared/types/action";
import { ActionsInTestEnum, InputNodeTypeEnum } from "@crusher-shared/constants/recordedActions";
import template from "@crusher-shared/utils/templateString";
import { ElementActionParams } from "@interfaces/actions";

// elementLocator.first(), null, step, this.globals, this.storageManager, this.exportsManager, this.sdk, this.context
async function addInput(params: ElementActionParams) {
	const { test } = params;
	const { currentStep } = test;
	const { element } = params.playwright;

	// For legacy addInput type
	if (typeof currentStep.payload.meta.value === "string") {
		await element.fill("");
		await element.type(template(currentStep.payload.meta.value, { ctx: test.context || {} }));
	}

	const { type, value, name, inputType } = currentStep.payload.meta.value;

	switch (type) {
		case InputNodeTypeEnum.INPUT:
		case InputNodeTypeEnum.CONTENT_EDITABLE:
		case InputNodeTypeEnum.TEXTAREA:
			await element.fill("");
			await element.type(template(value, { ctx: test.context || {} }));
			break;
		case InputNodeTypeEnum.RADIO:
			if (value) await element.check();
			break;
		case InputNodeTypeEnum.SELECT:
			if (value && value.length)
				await element.selectOption(
					value.map((a, index) => {
						return { index: a };
					}),
				);
			break;
		case InputNodeTypeEnum.CHECKBOX:
			if (value) await element.check();
	}
}

module.exports = {
	name: ActionsInTestEnum.ADD_INPUT,
	description: "Adding input to element",
	actionDescriber: (action: iAction) => {
		if (action.payload.meta && action.payload.meta.elementDescription) {
			const inputValue = typeof action.payload.meta.value === "string" ? action.payload.meta.value : action.payload.meta.value.value;

			return `Type [${inputValue}] in [${action.payload.meta.elementDescription}]`;
		}
		return `Type [${action.payload.meta.value}] in element`;
	},
	handler: addInput,
};

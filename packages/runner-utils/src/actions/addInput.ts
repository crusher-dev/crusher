import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";
import { ActionsInTestEnum, InputNodeTypeEnum } from "@crusher-shared/constants/recordedActions";
import template from "@crusher-shared/utils/templateString";

// elementLocator.first(), null, step, this.globals, this.storageManager, this.exportsManager, this.sdk, this.context
async function addInput(element: Locator, workingSelector: any, action: iAction, globals, storageManager, exportManager, _, __, context) {
	// For legacy addInput type
	console.log("Add input context", context);
	if (typeof action.payload.meta.value === "string") {
		await element.fill("");
		await element.type(template(action.payload.meta.value, { ctx: context || {} }));
	}

	const { type, value, name, inputType } = action.payload.meta.value;

	switch (type) {
		case InputNodeTypeEnum.INPUT:
		case InputNodeTypeEnum.CONTENT_EDITABLE:
		case InputNodeTypeEnum.TEXTAREA:
			await element.fill("");
			await element.type(template(value, { ctx: context || {} } ));
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
		const inputValue = typeof action.payload.meta.value === "string" ? action.payload.meta.value : action.payload.meta.value.value;

		return `Type [${inputValue}] to [${action.payload.meta.elementDescription}]`;
	},
	handler: addInput,
};

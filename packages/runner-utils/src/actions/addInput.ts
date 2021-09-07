import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";
import { type } from "../functions/type";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";

async function addInput(element: Locator, workingSelector: any, action: iAction) {
	const valueToType = action.payload.meta.value;
	await element.type(valueToType);
}

module.exports = {
	name: ActionsInTestEnum.ADD_INPUT,
	description: "Adding input to element",
	handler: addInput,
};

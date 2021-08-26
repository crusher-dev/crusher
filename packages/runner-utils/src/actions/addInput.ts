import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";
import { type } from "../functions/type";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";

async function addInput(element: Locator, workingSelector: any, action: iAction) {
	const inputKeys = action.payload.meta.value;
	await element.elementHandle({ timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined });
	await type(element, inputKeys);
}

module.exports = {
	name: ActionsInTestEnum.ADD_INPUT,
	description: "Adding input to element",
	handler: addInput,
};

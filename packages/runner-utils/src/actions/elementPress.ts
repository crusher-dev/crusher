import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";

async function pressKey(element: Locator, workingSelector: any, action: iAction) {
	const keyToBePressed = action.payload.meta.value;
	await element.press(keyToBePressed);
}

module.exports = {
	name: ActionsInTestEnum.PRESS,
	description: "Press key to element",
	handler: pressKey,
};

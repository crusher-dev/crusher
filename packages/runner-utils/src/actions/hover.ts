import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";
import { markTestFail } from "../utils/helper";

async function hoverOnElement(element: Locator, workingSelector: any, action: iAction) {
	await element.hover({ timeout: action.payload.timeout ? action.payload.timeout * 1000 : 5000 });
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

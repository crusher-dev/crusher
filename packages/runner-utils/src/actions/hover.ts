import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";
import { markTestFail } from "../utils/helper";

async function hoverOnElement(element: Locator, workingSelector: any, action: iAction) {
	await element.hover({ timeout: action.payload.timeout ? action.payload.timeout : 5000 });
}

module.exports = {
	name: ActionsInTestEnum.HOVER,
	description: "Hover on element",
	handler: hoverOnElement,
};

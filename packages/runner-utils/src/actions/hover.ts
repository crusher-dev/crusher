import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";
import { markTestFail } from "../utils/helper";

async function hoverOnElement(element: Locator) {
	await element.hover({ timeout: 5000 });
}

module.exports = {
	name: ActionsInTestEnum.HOVER,
	description: "Hover on element",
	handler: hoverOnElement,
};

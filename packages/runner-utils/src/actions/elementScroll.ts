import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator, Page } from "playwright";
import { scrollElement } from "../functions/scroll";

async function scrollOnElement(elementHandle: Locator, workingSelector: any, action: iAction) {
	const scrollDelta = action.payload.meta.value;

	await scrollElement(scrollDelta, await elementHandle.elementHandle({ timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined }));
}

module.exports = {
	name: ActionsInTestEnum.ELEMENT_SCROLL,
	description: "Scroll on element",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Scroll on element`;
		}

		return `Scroll on element ${action.payload.meta.elementDescription}`;
	},
	handler: scrollOnElement,
};

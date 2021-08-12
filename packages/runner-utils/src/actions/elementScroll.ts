import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { ElementHandle, Page } from "playwright";
import { scrollElement } from "../functions/scroll";

async function scrollOnElement(elementHandle: ElementHandle, action: iAction) {
    const scrollDelta = action.payload.meta.value;

    await scrollElement(scrollDelta, elementHandle);
}

module.exports = {
	name: ActionsInTestEnum.ELEMENT_SCROLL,
    description: "Scroll on element",
    handler: scrollOnElement,
}
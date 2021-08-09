import { iAction } from "@crusher-shared/types/action";
import { ElementHandle, Page } from "playwright";

async function focusOnElement(element: ElementHandle, action: iAction) {
	await element.focus();
}

module.exports = {
    name: "ELEMENT_FOCUS",
    description: "Focus on element",
    handler: focusOnElement,
}
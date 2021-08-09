import { iAction } from "@crusher-shared/types/action";
import { ElementHandle, Page } from "playwright";

async function clickOnElement(element: ElementHandle, action: iAction) {
	await element.dispatchEvent("click");
}

module.exports = {
    name: "ELEMENT_CLICK",
    description: "Click on element",
    handler: clickOnElement,
}
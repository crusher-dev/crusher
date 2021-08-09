import { iAction } from "@crusher-shared/types/action";
import { ElementHandle } from "playwright";

async function hoverOnElement(element: ElementHandle, action: iAction) {
    await element.hover();
}

module.exports = {
    name: "ELEMENT_HOVER",
    description: "Hover on element",
    handler: hoverOnElement,
}
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { ElementHandle, Page } from "playwright";
import { toCrusherSelectorsFormat } from "../utils/helper";

async function hoverOnElement(page: Page, element: ElementHandle, workingSelector: any, step: any, globals: any, storage: any, selectors: Array<iSelectorInfo>) {
	await page.hover(toCrusherSelectorsFormat(selectors).value, { force: true });
}

module.exports = {
	name: ActionsInTestEnum.HOVER,
	description: "Hover on element",
	handler: hoverOnElement,
};

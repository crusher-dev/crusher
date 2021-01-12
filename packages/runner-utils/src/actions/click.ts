import { waitForSelectors } from "../functions";
import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

export default function click(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try{
		const selectors = action.payload.selectors as iSelectorInfo[];
		const selector = await waitForSelectors(page, selectors);

		if(!selector || typeof selector !== "string"){
			return error(`Invalid selector`);
		}
		const elementHandle = await page.$(selector as string);
		if (!elementHandle) {
			return error(`No element with selector as ${selector} exists`);
		}

		await elementHandle.scrollIntoViewIfNeeded();
		await elementHandle.dispatchEvent("click");

		// If under navigation wait for load state to complete.
		await page.waitForLoadState();

		return success({
			message: `Clicked on the element ${selector}`,
		});
		} catch(err){
			return error("Some issue occurred while clicking on element");
		}
	});
}

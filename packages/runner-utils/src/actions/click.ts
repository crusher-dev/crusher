import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { toCrusherSelectorsFormat } from "../utils/helper";
import { waitForSelectors } from "../functions";

export default function click(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			await waitForSelectors(page, selectors);

			const elementHandle = await page.$(toCrusherSelectorsFormat(selectors));
			if (!elementHandle) {
				return error(`No element with selector as ${selectors[0].value} exists`);
			}

			await elementHandle.scrollIntoViewIfNeeded();
			await elementHandle.dispatchEvent("click");

			// If under navigation wait for load state to complete.
			await page.waitForLoadState();

			return success({
				message: `Clicked on the element ${selectors[0].value}`,
			});
		} catch (err) {
			return error("Some issue occurred while clicking on element");
		}
	});
}

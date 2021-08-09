import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { waitForSelectors } from "../functions";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { toCrusherSelectorsFormat } from "../utils/helper";

export function focusOnElement(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			const selectorInfo = await waitForSelectors(page, selectors);
			console.log("Starting selector", selectorInfo);
			const elementHandle = await page.$(selectorInfo.value);

			await elementHandle?.focus();
			const pageUrl = await page.url();

			return success({
				message: `Successfully focused on element`,
				pageUrl: pageUrl,
				selector: selectorInfo,
			});
		} catch (err) {
			console.log(err);
			return error("Some issue occurred while focusing on element");
		}
	});
}

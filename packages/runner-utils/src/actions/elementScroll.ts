import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { scroll, waitForSelectors } from "../functions";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

export default function capturePageScreenshot(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		const selectors = action.payload.selectors as iSelectorInfo[];
		const selector = await waitForSelectors(page, selectors);

		if (!selector) {
			return error(`Attempt to scroll element with invalid selector: ${selector}`);
		}

		const scrollDelta = action.payload.meta.value;
		const pageUrl = await page.url();
		await scroll(page, selector, scrollDelta);

		return success({
			message: `Scrolled successfully on ${pageUrl}`,
		});
	});
}

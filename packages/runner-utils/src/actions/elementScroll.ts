import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { scroll, waitForSelectors } from "../functions";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

export default function capturePageScreenshot(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			const output = await waitForSelectors(page, selectors);

			const scrollDelta = action.payload.meta.value;
			const pageUrl = await page.url();
			await scroll(page, output ? [output] : selectors, scrollDelta, false);

			return success({
				message: `Scrolled successfully on ${pageUrl}`,
			});
		} catch(err){
			console.log(err);
			return error("Some issue occurred while scrolling on element");
		}
	});
}

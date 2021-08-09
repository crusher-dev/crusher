import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { generateScreenshotName, toCrusherSelectorsFormat } from "../utils/helper";
import { waitForSelectors } from "../functions";

export default function elementScreenshot(action: iAction, page: Page, stepIndex: number) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			const selectorInfo = await waitForSelectors(page, selectors);
			const elementHandle = await page.$(selectorInfo.value);
			if (!elementHandle) {
				return error(`Attempt to capture screenshot of element with invalid selector: ${selectors[0].value}`);
			}

			const elementScreenshotBuffer = await elementHandle.screenshot();
			const pageUrl = await page.url();
			console.log("ELEMENT SCREEN", selectorInfo);
			return success({
				message: `Captured element screenshot for ${selectorInfo.value}`,
				selector: selectorInfo,
				pageUrl: pageUrl,
				output: {
					name: generateScreenshotName(selectors[0].value, stepIndex),
					value: elementScreenshotBuffer,
				},
			});
		} catch (err) {
			console.log(err);
			return error("Some issue occurred while capturing screenshot of element");
		}
	});
}

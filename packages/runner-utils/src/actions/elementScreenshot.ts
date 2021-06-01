import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { generateScreenshotName, toCrusherSelectorsFormat } from "../utils/helper";
import { waitForSelectors } from "../functions";

export default function elementScreenshot(action: iAction, page: Page, stepIndex: number) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			await waitForSelectors(page, selectors);
			const elementHandle = await page.$(toCrusherSelectorsFormat(selectors));
			if (!elementHandle) {
				return error(`Attempt to capture screenshot of element with invalid selector: ${selectors[0].value}`);
			}

			const elementScreenshotBuffer = await elementHandle.screenshot();

			return success({
				message: `Captured element screenshot for ${selectors[0].value}`,
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

import { iSelectorInfo } from '@crusher-shared/types/selectorInfo';
import { waitForSelectors } from '../functions';
import { Page } from 'playwright';
import { iAction } from '@crusher-shared/types/action';
import { generateScreenshotName } from '../utils/helper';

export default function elementScreenshot(action: iAction, page: Page, stepIndex: number) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			const selector = await waitForSelectors(page, selectors);

			if (!selector || typeof selector !== 'string') {
				return error(`Invalid selector`);
			}

			const elementHandle = await page.$(selector as string);
			if (!elementHandle) {
				return error(`Attempt to capture screenshot of element with invalid selector: ${selector}`);
			}

			const elementScreenshotBuffer = await elementHandle.screenshot();

			return success({
				message: `Captured element screenshot for ${selector}`,
				output: { name: generateScreenshotName(selector, stepIndex), value: elementScreenshotBuffer },
			});
		} catch (err) {
			return error('Some issue occurred while capturing screenshot of element');
		}
	});
}

import { iSelectorInfo } from '@crusher-shared/types/selectorInfo';
import { waitForSelectors } from '../functions';
import { Page } from 'playwright';
import { iAction } from '@crusher-shared/types/action';
import * as path from 'path';

function generateScreenshotName(selector: string, stepIndex: number): string {
	return selector.replace(/[^\w\s]/gi, '').replace(/ /g, '_') + `_${stepIndex}.png`;
}
export default function elementScreenshot(action: iAction, page: Page, stepIndex: number, assetsDir: string) {
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

			await elementHandle.screenshot({
				path: path.resolve(assetsDir, generateScreenshotName(selector as string, stepIndex)),
			});

			return success({
				message: `Captured element screenshot for ${selector}`,
			});
		} catch (err) {
			return error('Some issue occurred while capturing screenshot of element');
		}
	});
}

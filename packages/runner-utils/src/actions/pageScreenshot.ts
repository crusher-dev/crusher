import { Page } from 'playwright';
import { generateScreenshotName } from '../utils/helper';

export default function capturePageScreenshot(page: Page, stepIndex: number) {
	return new Promise(async (success, error) => {
		try {
			const pageTitle = await page.title();
			const pageUrl = await page.url();
			const screenshotBuffer = await page.screenshot();

			return success({
				message: `Clicked page screenshot for ${pageUrl}`,
				output: { name: generateScreenshotName(pageTitle, stepIndex), value: screenshotBuffer },
			});
		} catch (err) {
			return error('Some issue occurred while capturing screenshot of page');
		}
	});
}

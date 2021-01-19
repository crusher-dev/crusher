import { Page } from 'playwright';
import * as path from 'path';

let screenshotIndex = 0;

function generatePageScreenshotName(title: string): string {
	return title.replace(/[^\\w\\s]/gi, '').replace(/ /g, '_') + `_${screenshotIndex++}.png`;
}
export default function capturePageScreenshot(page: Page, assetsDir: string) {
	return new Promise(async (success, error) => {
		try {
			const pageTitle = await page.title();
			const pageUrl = await page.url();
			await page.screenshot({ path: path.resolve(assetsDir, generatePageScreenshotName(pageTitle)) });

			return success({
				message: `Clicked page screenshot for ${pageUrl}`,
			});
		} catch (err) {
			return error('Some issue occurred while capturing screenshot of page');
		}
	});
}

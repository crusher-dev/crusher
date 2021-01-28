import { Page } from 'playwright';
import * as path from 'path';

function generatePageScreenshotName(title: string, stepIndex: number): string {
	return title.replace(/[^\\w\\s]/gi, '').replace(/ /g, '_') + `_${stepIndex}.png`;
}
export default function capturePageScreenshot(page: Page, stepIndex: number, assetsDir: string) {
	return new Promise(async (success, error) => {
		try {
			const pageTitle = await page.title();
			const pageUrl = await page.url();
			await page.screenshot({ path: path.resolve(assetsDir, generatePageScreenshotName(pageTitle, stepIndex)) });

			return success({
				message: `Clicked page screenshot for ${pageUrl}`,
			});
		} catch (err) {
			return error('Some issue occurred while capturing screenshot of page');
		}
	});
}

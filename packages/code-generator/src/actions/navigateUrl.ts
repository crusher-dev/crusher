import { Page } from "playwright";
import { iAction } from "../../../crusher-shared/types/action";

export default async function navigateUrl(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		const urlToGo = action.payload.meta.value;
		const pageUrl = await page.url();

		await page.goto(urlToGo);

		return success({
			message: `Navigated successfully to ${pageUrl}`,
		});
	});
}

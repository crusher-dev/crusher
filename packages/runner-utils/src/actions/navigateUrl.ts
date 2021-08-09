import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";

export async function navigateToUrl(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const urlToGo = action.payload.meta.value;

			await page.goto(urlToGo);

			const urlNow = await page.url();
			return success({
				message: `Navigated successfully to ${urlToGo}`,
				pageUrl: urlNow,
			});
		} catch (err) {
			console.error(err);
			return error("Some issue occurred while navigating to webpage");
		}
	});
}

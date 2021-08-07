import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { getLastSavedPageUrl } from "../utils/state";

export default async function waitForNavigation(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const currentUrl = await page.url();
			const lastSavedUrl = getLastSavedPageUrl();
			if (currentUrl === lastSavedUrl) {
				await page.waitForNavigation();
			} else {
				await page.waitForLoadState();
			}
			return success({
				message: `Waited for navigation successfully`,
				isSamePageAsNow: currentUrl === lastSavedUrl
			});
		} catch (err) {
			console.error(err);
			return error("Error occured while waiting for navigation");
		}
	});
}

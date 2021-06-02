import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";

export default async function waitForNavigation(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {

			await page.waitForNavigation();

			return success({
				message: `Waited for navigation successfully`,
			});
		} catch(err){
			console.error(err);
			return error("Error occured while waiting for navigation");
		}
	});
}

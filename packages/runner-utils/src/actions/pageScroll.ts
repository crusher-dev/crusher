import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { scroll } from "../functions";

export async function scrollPage(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const scrollDelta = action.payload.meta.value;
			const pageUrl = await page.url();
			const scrollResult = await scroll(page, [], scrollDelta);

			return success({
				message: `Scrolled successfully on ${pageUrl}`,
				pageUrl: pageUrl,
				selector: scrollResult,
			});
		} catch (err) {
			console.log(err);
			return error("Some issue occurred while scrolling the page");
		}
	});
}

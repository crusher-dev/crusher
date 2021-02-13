import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { scroll } from "../functions";

export default function capturePageScreenshot(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const scrollDelta = action.payload.meta.value;
			const pageUrl = await page.url();
			await scroll(page, [], scrollDelta);

			return success({
				message: `Scrolled successfully on ${pageUrl}`,
			});
		} catch(err){
			console.log(err);
			return error("Some issue occurred while scrolling the page");
		}
	});
}

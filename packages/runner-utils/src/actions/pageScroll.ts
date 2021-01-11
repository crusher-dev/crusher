import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { scroll } from "../functions";

export default function capturePageScreenshot(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		const scrollDelta = action.payload.meta.value;
		const pageUrl = await page.url();
		await scroll(page, "window", scrollDelta);

		return success({
			message: `Scrolled successfully on ${pageUrl}`,
		});
	});
}

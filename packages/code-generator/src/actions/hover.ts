import waitForSelectors from "../functions/waitForSelectors";
import { Page } from "playwright";
import { iAction } from "../../../crusher-shared/types/action";
import { iSelectorInfo } from "../../../crusher-shared/types/selectorInfo";

export default async function hover(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		const selectors = action.payload.selectors as iSelectorInfo[];
		const selector = await waitForSelectors(page, selectors);

		if (!selector)
			return error(
				`Attempt to hover on element with no valid selector ${selector}`,
			);

		await page.hover(selector);

		return success({
			message: `Hovered on the element ${selector}`,
		});
	});
}

import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { toCrusherSelectorsFormat } from "../utils/helper";
import { waitForSelectors } from "../functions";

export default async function hover(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];

			const selectorInfo = await waitForSelectors(page, selectors);
			await page.hover(selectorInfo.value);

			const pageUrl = await page.url();

			return success({
				message: `Hovered on the element ${selectors[0].value}`,
				pageUrl: pageUrl,
				selector: selectorInfo
			});
		} catch (err) {
			console.error(err);
			return error("Some issue occurred while hovering on element");
		}
	});
}

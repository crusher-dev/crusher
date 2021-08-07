import { assertElement } from "../functions";
import { Page } from "playwright";
import { iAction } from "../../../crusher-shared/types/action";
import { iSelectorInfo } from "../../../crusher-shared/types/selectorInfo";

export default function assert(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			const validationRows = action.payload.meta.validations;
			const output = await assertElement(page, selectors, validationRows);
			const pageUrl = await page.url();
			return success({
				message: `Successfully asserted element ${selectors[0].value}`,
				selector: output.selector,
				pageUrl: pageUrl,
				result: output,
			});
		} catch (err) {
			return error("Some issue occurred while asserting element");
		}
	});
}

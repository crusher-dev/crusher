import waitForSelectors from "../functions/waitForSelectors";
import { Page } from "playwright";
import { iAction } from "../../../crusher-shared/types/action";
import { iSelectorInfo } from "../../../crusher-shared/types/selectorInfo";
import type from "../functions/type";

export default function addInput(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		const selectors = action.payload.selectors as iSelectorInfo[];
		const inputKeys = action.payload.meta.value;

		const selector = await waitForSelectors(page, selectors);

		const elementHandle = await page.$(selector as string);
		if (!elementHandle) {
			return error(
				`Attempt to press keycodes on element with invalid selector: ${selector}`,
			);
		}

		await elementHandle.scrollIntoViewIfNeeded();
		await type(elementHandle, inputKeys);

		return success({
			message: `Pressed keys on the element ${selector}`,
		});
	});
}

import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { type, waitForSelectors } from '../functions';
import { toCrusherSelectorsFormat } from '../utils/helper';

export default function addInput(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			const inputKeys = action.payload.meta.value;

			const output = await waitForSelectors(page, selectors);
			const elementHandle = await page.$(output ? output.value : toCrusherSelectorsFormat(selectors));
			if (!elementHandle) {
				return error(
					`Attempt to press keycodes on element with invalid selector: ${selectors[0].value}`,
				);
			}

			await elementHandle.scrollIntoViewIfNeeded();
			await type(elementHandle, inputKeys);

			return success({
				message: `Pressed keys on the element ${selectors[0].value}`,
			});
		} catch(err){
			return error("Some issue occurred while adding input to element");
		}
	});
}

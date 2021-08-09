import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { scroll, waitForSelectors } from "../functions";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

export function scrollElement(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			const selectorInfo = await waitForSelectors(page, selectors);

			const scrollDelta = action.payload.meta.value;
			await scroll(page, selectorInfo ? [selectorInfo] : selectors, scrollDelta, false);

			return success({
				message: `Scrolled successfully on element ${selectorInfo.value}`,
				selector: selectorInfo
			});
		} catch (err) {
			console.log(err);
			return error("Some issue occurred while scrolling on element");
		}
	});
}

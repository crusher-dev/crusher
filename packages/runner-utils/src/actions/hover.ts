import { waitForSelectors } from "../functions";
import { Page } from "playwright";
import { iAction } from "@crusher-shared/types/action";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

export default async function hover(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try {
			const selectors = action.payload.selectors as iSelectorInfo[];
			const selector = await waitForSelectors(page, selectors);


			if(!selector || typeof selector !== "string"){
				return error(`Invalid selector`);
			}

			await page.hover(selector);

			return success({
				message: `Hovered on the element ${selector}`,
			});
		} catch(err){
			return error("Some issue occurred while hovering on element");
		}
	});
}

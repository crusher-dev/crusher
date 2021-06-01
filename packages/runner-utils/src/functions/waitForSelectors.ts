import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { Page } from "playwright";
import { toCrusherSelectorsFormat } from "../utils/helper";

export default async function waitForSelectors(page: Page, selectors: Array<iSelectorInfo>) {
	await page.waitForSelector(toCrusherSelectorsFormat(selectors), {
		state: "attached",
	});
}

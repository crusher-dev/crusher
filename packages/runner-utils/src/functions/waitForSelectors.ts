import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { Page } from "playwright";
import { toCrusherSelectorsFormat } from "../utils/helper";
import { SELECTOR_TYPE } from "../../../unique-selector/src/constants";

export default async function waitForSelectors(page: Page, selectors: Array<iSelectorInfo>): Promise<iSelectorInfo | undefined> {
	let playwrightOut: string | null = null;
	if (selectors[0].type == SELECTOR_TYPE.PLAYWRIGHT) {
		try {
			await page.waitForSelector(selectors[0].value, { state: "attached" });
			playwrightOut = selectors[0].value;
		} catch (ex) {}
		selectors.shift();
	}

	if (playwrightOut) {
		return {value: playwrightOut as any, type: SELECTOR_TYPE.PLAYWRIGHT};
	}
	const encodedSelector = toCrusherSelectorsFormat(selectors);
	const elementHandle = await (await page.waitForSelector(encodedSelector.value)).evaluate(`const l = window["${encodedSelector.uuid}"]; delete window["${encodedSelector.uuid}"];  l;`);
	return {value: (elementHandle as any).selector as any, type: (elementHandle as any).selectorType as any};
}

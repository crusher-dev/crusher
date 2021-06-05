import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { Page } from "playwright";
import { toCrusherSelectorsFormat } from '../utils/helper';
import { SELECTOR_TYPE } from '../../../unique-selector/src/constants';

export default async function waitForSelectors(
	page: Page,
	selectors: Array<iSelectorInfo>
): Promise<iSelectorInfo | undefined> {
	let playwrightOut: iSelectorInfo | null = null;
	if(selectors[0].type == SELECTOR_TYPE.PLAYWRIGHT) {
		try {
		 await page.waitForSelector(selectors[0].value, { state: "attached" });
		 playwrightOut = selectors[0];
		} catch(ex){}
		selectors.shift();
	}

	if(playwrightOut) {
		return playwrightOut;
	}

	await page.waitForSelector(toCrusherSelectorsFormat(selectors));

	return;
}

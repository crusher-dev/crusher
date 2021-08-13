import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { Page } from "playwright";
import { toCrusherSelectorsFormat } from "../utils/helper";
import { IFoundSelectorInfo, SelectorTypeEnum } from "../interfaces";

async function findSelectorFromPlaywright(page: Page, selectors: Array<iSelectorInfo>): Promise<IFoundSelectorInfo | boolean> {
	let playwrightOut, elementHandle;
	if (selectors[0].type == SelectorTypeEnum.PLAYWRIGHT) {
		try {
			elementHandle = await page.waitForSelector(selectors[0].value, { state: "visible" });
			playwrightOut = selectors[0].value;
		} catch (ex) {
			return false;
		}
		selectors.shift();
	}

	if (!elementHandle) return false;

	return { elementHandle, workingSelector: { value: playwrightOut, type: SelectorTypeEnum.PLAYWRIGHT } };
}

export async function waitForSelectors(page: Page, selectors: Array<iSelectorInfo>): Promise<IFoundSelectorInfo | undefined> {
	const elementFromPlaywrightSelector = await findSelectorFromPlaywright(page, selectors);
	if (elementFromPlaywrightSelector) {
		return elementFromPlaywrightSelector as IFoundSelectorInfo;
	}

	const encodedSelector = toCrusherSelectorsFormat(selectors);
	const elementHandle = await page.waitForSelector(encodedSelector.value);
	const selectorInfo: { selector: string; selectorType: SelectorTypeEnum } = await elementHandle.evaluate(
		`const l = window["${encodedSelector.uuid}"]; delete window["${encodedSelector.uuid}"];  l;`,
	);

	return {
		elementHandle: elementHandle,
		workingSelector: {
			value: selectorInfo.selector,
			type: selectorInfo.selectorType,
		},
	};
}

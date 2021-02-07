import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { Page } from "playwright";
import { generateQuerySelector, getElementsByXPath } from "../utils/dom";

async function getValidSelectorFromDOM(page: Page, selectors: Array<iSelectorInfo>) {
	const validSelector = await page.evaluate((selectors) => {
		for (const selector of selectors) {
			try {
				if (selector.type === "xpath") {
					const elements = getElementsByXPath(selector.value);
					if (elements.length) {
						const elementSelectorFromXpath = generateQuerySelector(
							elements[0] as HTMLElement,
						);

						return elementSelectorFromXpath;
					}
				} else if (document.querySelector(selector.value)) {
					return selector.value;
				}
			} catch (ex) {
				console.debug("Caught exception", ex);
			}
		}
		return null;
	}, selectors);
	return validSelector;
};

export default async function waitForSelectors(
	page: Page,
	selectors: Array<iSelectorInfo>,
	defaultSelector = null as string | null,
) {
	if (!defaultSelector) {
		defaultSelector = selectors[0].value;
	}

	try {
		const validSelector = await getValidSelectorFromDOM(page, selectors);
		if(validSelector){
			return validSelector;
		}
		await page.waitForSelector(defaultSelector, { state: "attached" });
		return defaultSelector;
	} catch {
		const validSelector = await getValidSelectorFromDOM(page, selectors);
		if (typeof validSelector === "undefined") {
			throw new Error("This is not working");
		}
		return validSelector;
	}
}

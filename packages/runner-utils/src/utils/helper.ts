import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

const generateScreenshotName = (selector: string, stepIndex: number): string => {
	return selector.replace(/[^\w\s]/gi, "").replace(/ /g, "_") + `_${stepIndex}.png`;
};

const toCrusherSelectorsFormat = (selectors: Array<iSelectorInfo>) => {
	return `crusher=${encodeURIComponent(JSON.stringify(selectors))}`;
};

export { generateScreenshotName, toCrusherSelectorsFormat };

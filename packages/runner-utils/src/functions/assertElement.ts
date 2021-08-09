import { Page } from "playwright";
import { iAssertionRow } from "../../../crusher-shared/types/assertionRow";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { toCrusherSelectorsFormat } from "../utils/helper";
import { waitForSelectors } from "./index";

export default async function assertElementAttributes(page: Page, selectors: Array<iSelectorInfo>, assertions: Array<iAssertionRow>): Promise<{selector: iSelectorInfo, hasPassed: boolean, logs: Array<{status: "FAILED" | "DONE", message: string, meta: any}>}> {
	const selectorInfo = await waitForSelectors(page, selectors);
	const elHandle = await page.$(selectorInfo.value);
	let hasPassed = true;
	const logs = [];

	const selector = selectorInfo.value;

	for (let i = 0; i < assertions.length; i++) {
		const { validation, operation, field } = assertions[i];
		const elementAttributeValue = await elHandle!.getAttribute(field.name);
		if (operation === "matches") {
			if (elementAttributeValue !== validation) {
				hasPassed = false;
				logs.push({
					status: "FAILED",
					message: "Failed to assert attribute=" + validation + " of " + selector + "",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			} else {
				logs.push({
					status: "DONE",
					message: "Asserted attribute=" + validation + " of " + selector + "",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			}
		} else if (operation === "contains") {
			const doesContain = elementAttributeValue!.includes(validation);
			if (!doesContain) {
				hasPassed = false;
				logs.push({
					status: "FAILED",
					message: "Failed to assert attribute contains " + validation + " of " + selector + "",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			} else {
				logs.push({
					status: "DONE",
					message: "Asserted attribute contains " + validation + " of " + selector + "",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			}
		} else if (operation === "regex") {
			const rgx = new RegExp(validation);
			if (!rgx.test(elementAttributeValue!)) {
				hasPassed = false;
				logs.push({
					status: "FAILED",
					message: "Failed to assert attribute matches regex: " + validation + " of " + selector + "",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			} else {
				logs.push({
					status: "DONE",
					message: "Asserted attribute matches regex: " + validation + " of " + selector + "",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			}
		}
	}

	return {hasPassed, logs, selector: selectorInfo}
}

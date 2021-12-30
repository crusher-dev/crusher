import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { iAssertionRow } from "@crusher-shared/types/assertionRow";
import { Page } from "playwright";
import { markTestFail } from "../utils/helper";

async function assertSeoRows(
	page: Page,
	assertions: iAssertionRow[],
): Promise<{ hasPassed: boolean; logs: { status: "FAILED" | "DONE"; message: string; meta: any }[] }> {
	let hasPassed = true;
	const logs = [];

	const pageTitle = await page.title();

	for (const { validation, operation, field } of assertions) {
		const elementAttributeValue =
			field.name === "title"
				? pageTitle
				: await page.evaluate(
						(args: any[]) => {
							const getTagName = (metaTagName) => {
								const metaElement = document.querySelector(`meta[name='${metaTagName}']`);
								const metaElementValue = metaElement ? metaElement.getAttribute("content") : null;
								if (metaElementValue) return metaElementValue;

								return null;
							};

							return getTagName(args[0]);
						},
						[field.name],
				  );

		if (!elementAttributeValue) {
			hasPassed = false;
			logs.push({
				status: "FAILED",
				message: "No value found for this seo field: " + field.name,
				meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
			});

			continue;
		}

		if (operation === "MATCHES") {
			if (elementAttributeValue !== validation) {
				hasPassed = false;
				logs.push({
					status: "FAILED",
					message: "Failed to assert attribute=" + validation + " of element",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			} else {
				logs.push({
					status: "DONE",
					message: "Asserted attribute=" + validation + " of element",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			}
		} else if (operation === "CONTAINS") {
			const doesContain = elementAttributeValue!.includes(validation);
			if (!doesContain) {
				hasPassed = false;
				logs.push({
					status: "FAILED",
					message: "Failed to assert attribute contains " + validation + " of element",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			} else {
				logs.push({
					status: "DONE",
					message: "Asserted attribute contains " + validation + " of element",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			}
		} else if (operation === "REGEX") {
			const rgx = new RegExp(validation);
			if (!rgx.test(elementAttributeValue!)) {
				hasPassed = false;
				logs.push({
					status: "FAILED",
					message: "Failed to assert attribute matches regex: " + validation + " of element",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			} else {
				logs.push({
					status: "DONE",
					message: "Asserted attribute matches regex: " + validation + " of element",
					meta: { operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue },
				});
			}
		}
	}

	return { hasPassed, logs };
}

async function runSEOAssertionOnPage(page: Page, action: iAction) {
	const validationRows = action.payload.meta.validations;
	const actionResult = await assertSeoRows(page, validationRows);

	if (!actionResult.hasPassed) markTestFail("Failed assertions on element", { meta: { logs: actionResult.logs } });

	return {
		customLogMessage: "Ran seo assertions",
		meta: {
			logs: actionResult.logs,
		},
	};
}

module.exports = {
	name: ActionsInTestEnum.VALIDATE_SEO,
	description: "SEO Assertions on page",
	handler: runSEOAssertionOnPage,
};

import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { iAssertionRow } from "@crusher-shared/types/assertionRow";
import template from "@crusher-shared/utils/templateString";
import { Page } from "playwright";
import { StepErrorTypeEnum } from "../../../error.types";
import { CommunicationChannel } from "../../../functions/communicationChannel";
import { ExportsManager } from "../../../functions/exports";
import { CrusherSdk } from "../../../sdk/sdk";
import { markTestFail } from "../../../utils/helper";

async function assertSeoRows(
	page: Page,
	assertions: Array<iAssertionRow>,
	context: any,
): Promise<{ hasPassed: boolean; logs: Array<{ status: "FAILED" | "DONE"; message: string; meta: any }> }> {
	let hasPassed = true;
	const logs = [];

	const pageTitle = await page.title();

	for (let i = 0; i < assertions.length; i++) {
		let { validation, operation, field } = assertions[i];
		validation = template(validation, { ctx: context || {} });
		const elementAttributeValue =
			field.name === "title"
				? pageTitle
				: await page.evaluate(
						(args: Array<any>) => {
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

async function runSEOAssertionOnPage(
	page: Page,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	communicationChannel: CommunicationChannel,
	sdk: CrusherSdk | null,
	context: any,
) {
	const validationRows = action.payload.meta.validations;
	const actionResult = await assertSeoRows(page, validationRows, context);

	if (!actionResult.hasPassed) markTestFail("Failed assertions on element", { type: StepErrorTypeEnum.ASSERTIONS_FAILED, meta: { logs: actionResult.logs } });

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
	actionDescriber: (action: iAction) => {
		return `Validate SEO assertions on page`;
	},
	handler: runSEOAssertionOnPage,
};

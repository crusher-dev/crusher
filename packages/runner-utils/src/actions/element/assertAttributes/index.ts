import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { iAssertionRow } from "@crusher-shared/types/assertionRow";
import template from "@crusher-shared/utils/templateString";
import { Locator } from "playwright";
import { StepErrorTypeEnum } from "../../../error.types";
import { markTestFail } from "../../../utils/helper";

async function assertElementAttributes(
	element: Locator,
	assertions: Array<iAssertionRow>,
	context: any,
): Promise<{ hasPassed: boolean; logs: Array<{ status: "FAILED" | "DONE"; message: string; meta: any }> }> {
	let hasPassed = true;
	const logs = [];

	const elementInfo = await (
		await element.evaluateHandle((element: HTMLInputElement | HTMLElement) => {
			return { tagName: element.tagName.toUpperCase(), inputValue: (element as HTMLInputElement).value };
		}, [])
	).jsonValue();

	for (let i = 0; i < assertions.length; i++) {
		let { validation, operation, field } = assertions[i];
		validation = template(validation, { ctx: context || {} });
		let elementAttributeValue = null;
		if (field.name === "innerHTML") {
			elementAttributeValue = await element.innerHTML();
		} else if (field.name === "innerText") {
			elementAttributeValue = await element.innerText();
		} else {
			if (field.name.toLowerCase() === "value" && elementInfo.tagName === "INPUT") {
				elementAttributeValue = elementInfo.inputValue;
			} else {
				elementAttributeValue = await element.getAttribute(field.name);
			}
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

async function runAssertionOnElement(
	element: Locator,
	workingSelector: any,
	action: iAction,
	globals,
	storageManager,
	exportManager,
	communicationChannel,
	_,
	context,
) {
	const validationRows = action.payload.meta.validations;
	try {
		await (await element.elementHandle()).waitForElementState("visible");
	} catch (ex) {
		markTestFail(
			`Element ${action.payload.meta && action.payload.meta.elementDescription ? action.payload.meta.elementDescription + " " : ""}is not visible`,
			{ type: StepErrorTypeEnum.ELEMENT_NOT_VISIBLE }
		);
	}
	const actionResult = await assertElementAttributes(element, validationRows, context);

	if (!actionResult.hasPassed) markTestFail("Failed assertions on element", { type: StepErrorTypeEnum.ASSERTIONS_FAILED, meta: { logs: actionResult.logs } });

	return {
		customLogMessage: "Ran custom assertions on element",
		meta: {
			logs: actionResult.logs,
		},
	};
}

module.exports = {
	name: ActionsInTestEnum.ASSERT_ELEMENT,
	description: "Assertions on element",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) return "Assert element";

		return `Assert [${action.payload.meta.elementDescription}]`;
	},
	handler: runAssertionOnElement,
};

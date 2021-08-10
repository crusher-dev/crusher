import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { iAssertionRow } from "@crusher-shared/types/assertionRow";
import { ElementHandle } from "playwright";
import { markTestFail } from "src/utils/helper";

async function assertElementAttributes(element: ElementHandle, assertions: Array<iAssertionRow>): Promise<{hasPassed: boolean, logs: Array<{status: "FAILED" | "DONE", message: string, meta: any}>}> {
	let hasPassed = true;
	const logs = [];

	for (let i = 0; i < assertions.length; i++) {
		const { validation, operation, field } = assertions[i];
		const elementAttributeValue = await element.getAttribute(field.name);
		if (operation === "matches") {
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
		} else if (operation === "contains") {
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
		} else if (operation === "regex") {
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

	return {hasPassed, logs}
}

async function runAssertionOnElement(element: ElementHandle, action: iAction) {
    const validationRows = action.payload.meta.validations;
    const actionResult = await assertElementAttributes(element, validationRows);

    if(!actionResult.hasPassed) markTestFail("Failed assertions on element", {meta: {logs: actionResult.logs}});

    return {
        customLogMessage: "Ran custom assertions on element",
        meta: {
            logs: actionResult.logs,
        }
    };
}

module.exports = {
    name: ActionsInTestEnum.ASSERT_ELEMENT,
    description: "Assertions on element",
    handler: runAssertionOnElement,
}

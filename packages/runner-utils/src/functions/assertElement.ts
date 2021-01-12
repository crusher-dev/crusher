import { Page } from "playwright";
import { iAssertionRow } from '../../../crusher-shared/types/assertionRow';

export default async function assertElementAttributes(page: Page, selector: string, assertions: Array<iAssertionRow>){
	const elHandle = await page.$(selector);
	let hasPassed = true;
	const logs = [];

	for(let i = 0; i < assertions.length; i++) {
		const {validation, operation, field} = assertions[i];
		const elementAttributeValue = await elHandle!.getAttribute(field.name);
		if(operation === "matches") {
			if(elementAttributeValue !== validation){
				hasPassed = false;
				logs.push({status: "FAILED", message: "Failed to assert attribute="+validation+" of " + selector + "", meta: {operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue}});
			}
			else {
				logs.push({status: "DONE", message: "Asserted attribute="+validation+" of " + selector + "", meta: {operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue}});
			}
		} else if(operation === "contains") {
			const doesContain =  elementAttributeValue!.includes(validation);
			if(!doesContain ){
				hasPassed = false;
				logs.push({status: "FAILED", message: "Failed to assert attribute contains "+validation+" of " + selector + "", meta: {operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue}});
			}
			else {
				logs.push({status: "DONE", message: "Asserted attribute contains "+validation+" of " + selector + "", meta: {operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue}});
			}
		} else if(operation === "regex" ){
			const rgx = new RegExp(validation);
			if (!rgx.test(elementAttributeValue!)) {
				hasPassed = false;
				logs.push({status: "FAILED", message: "Failed to assert attribute matches regex: "+validation+" of " + selector + "", meta: {operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue}});
			} else {
				logs.push({status: "DONE", message: "Asserted attribute matches regex: "+validation+" of " + selector + "", meta: {operation, valueToMatch: validation, field: field.name, elementValue: elementAttributeValue}});
			}
		}
	}

	return [hasPassed, logs];
}

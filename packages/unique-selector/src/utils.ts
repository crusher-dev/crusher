import { Evaluator } from "./crusher-selector/types";

let evaluator: Evaluator;
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	evaluator = require("playwright-evaluator");
	console.log(evaluator);
} catch (e) {
	// this will only error on server side tests that
	// do not require the evaluator but depend on this file
}

export const getUniqueScore = (querySelector: string, target: Element): Number => {
	try {
		const totalNodes = evaluator.querySelectorAll(querySelector, target).length;
		return Number((1 / totalNodes).toPrecision());
	} catch (err) {
		return 0;
	}
};

export const getQuerySelector = (nodeName: string, attributeName: string, attributeValue: string | undefined): string => {
	return `${nodeName.toLowerCase()}[${attributeName}="${attributeValue}"]`;
};

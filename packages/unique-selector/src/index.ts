import { Configuration, UserConfiguration, DefaultConfiguration } from "./interfaces/config";
import { UniqueSelectorResult } from "./interfaces/result";
import { getIDSelectors } from "./selectors/id";
import { getDataAttribute } from "./selectors/dataAttribute";
import { getAttribute } from "./selectors/attribute";
import { getPnC } from "./selectors/pnc";
import { getSelectors } from "./crusher-selector/generateSelectors";
import { SELECTOR_TYPE } from "./constants";
import { Evaluator } from "./crusher-selector/types";

let evaluator: Evaluator;
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	evaluator = require("playwright-evaluator");
	console.log(evaluator);
} catch (e) {
	console.error(e);
	// this will only error on server side tests that
	// do not require the evaluator but depend on this file
}

/**
 * Entry File.
 */
class UniqueSelector {
	private _configuration: Configuration;

	/**
	 * Constructor for function. Take Config
	 * @param config
	 */
	constructor(config: UserConfiguration) {
		this._configuration = { ...DefaultConfiguration, ...config };
	}

	/**
	 *
	 * @param element. HTML Node for which you want to find code
	 * @return . Set of unique element with computed most unique element.
	 */
	getUniqueSelector(element: HTMLElement): UniqueSelectorResult {
		if (element.nodeType !== Node.ELEMENT_NODE) {
			throw new Error(`Can't generate CSS selector for non-element node type.`);
		}

		const idSelector = getIDSelectors(element, this._configuration.root);
		const getDataAttributesSelector = getDataAttribute(element, this._configuration.root);
		const geAttributesSelector = getAttribute(element, this._configuration.root);
		const classSelectors = getPnC(element, this._configuration.root);

		let selectors: any[] = [];
		const playwrightSelectors = getSelectors(element);

		if (playwrightSelectors && playwrightSelectors[0].length) {
			selectors.push(
				...playwrightSelectors.map((selector) => {
					const uniquenessScore = this.getUniquenessScore(selector, element);

					return {
						type: SELECTOR_TYPE.PLAYWRIGHT,
						value: selector,
						uniquenessScore: uniquenessScore,
					};
				}),
			);
			selectors = selectors.filter((a) => {
				return a.uniquenessScore === 1;
			});
		}

		selectors.push(...idSelector, ...getDataAttributesSelector, ...geAttributesSelector, ...classSelectors);
		selectors.sort((a, b) => Number(b.uniquenessScore) - Number(a.uniquenessScore));

		// @ts-ignore
		return {
			mostUniqueSelector: selectors[0],
			list: selectors,
		} as UniqueSelectorResult;
	}

	getUniquenessScore(playwrightSelector: string, currentElement: Node) {
		console.log(evaluator);
		try {
			const elements = evaluator.querySelectorAll(playwrightSelector, document.body);
			const elementsLength = elements.length;
			if (currentElement !== elements[0] || !elementsLength) return 0;
			return 1 / elementsLength;
		} catch (err) {
			return 0;
		}
	}
}

export default UniqueSelector;

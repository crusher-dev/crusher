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

export enum SelectorsModeEnum {
	NORMAL = "NORMAL",
	SHADOW_DOM_EXPERIMENTAL = "SHADOW_DOM_EXPERIMENTAL",
}

/**
 * Entry File.
 */
class UniqueSelector {
	private _configuration: Configuration;
	private selectorCache: Map<any, any>;

	/**
	 * Constructor for function. Take Config
	 * @param config
	 */
	constructor(config: UserConfiguration) {
		this._configuration = { ...DefaultConfiguration, ...config };
		this.selectorCache = new Map();
	}

	/**
	 *
	 * @param element. HTML Node for which you want to find code
	 * @return . Set of unique element with computed most unique element.
	 */
	getUniqueSelector(element: HTMLElement, useAdvancedSelector: boolean = false): UniqueSelectorResult {
		if (element.nodeType !== Node.ELEMENT_NODE) {
			throw new Error(`Can't generate CSS selector for non-element node type.`);
		}

		// This element is inside a shadow DOM, switch to shadow DOM mode
		const selectorMode =
			!!element.getRootNode() && element.getRootNode().nodeType !== element.DOCUMENT_NODE
				? SelectorsModeEnum.SHADOW_DOM_EXPERIMENTAL
				: SelectorsModeEnum.NORMAL;

		let selectors: any[] = [];

		if (selectorMode === SelectorsModeEnum.NORMAL) {
			const idSelector = getIDSelectors(element, this._configuration.root);
			const getDataAttributesSelector = getDataAttribute(element, this._configuration.root);
			const geAttributesSelector = getAttribute(element, this._configuration.root);
			const classSelectors = getPnC(element, this._configuration.root);
			selectors.push(...idSelector, ...getDataAttributesSelector, ...geAttributesSelector, ...classSelectors);
		}

		const playwrightSelectors = getSelectors(element, 1000, selectorMode, this.selectorCache, useAdvancedSelector);

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

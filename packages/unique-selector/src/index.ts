import { Configuration, UserConfiguration, DefaultConfiguration } from './interfaces/config';
import { UniqueSelectorResult } from './interfaces/result';
import { getIDSelectors } from './selectors/id';
import { getDataAttribute } from './selectors/dataAttribute';
import { getAttribute } from './selectors/attribute';
import { getPnC } from './selectors/pnc';
import { getSelector } from './crusher-selector/generateSelectors';
import { SELECTOR_TYPE } from './constants';

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

		let selectors = [];
		const playwrightSelector = getSelector(element);

		selectors.push(...idSelector, ...getDataAttributesSelector, ...geAttributesSelector, ...classSelectors);
		selectors.sort((a, b) => Number(b.uniquenessScore) - Number(a.uniquenessScore));

		if (playwrightSelector) {
			selectors = [
				{
					type: SELECTOR_TYPE.PLAYWRIGHT,
					value: playwrightSelector,
					uniquenessScore: 1,
				},
				...selectors,
			];
		}
		// @ts-ignore
		return {
			mostUniqueSelector: selectors[0],
			list: selectors,
		} as UniqueSelectorResult;
	}
}

export default UniqueSelector;

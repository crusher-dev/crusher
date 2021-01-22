import { Configuration, UserConfiguration, DefaultConfiguration } from './interfaces/config';
import { UniqueSelectorResult } from './interfaces/result';
import { getIDSelectors } from './selectors/id';
import { getDataAttribute } from './selectors/dataAttribute';
import { getAttribute } from './selectors/attribute';
import { getPnC } from './selectors/pnc';

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
		const genPnCSelectors = getPnC(element, this._configuration.root);

		const selectors = [];

		selectors.push(...idSelector, ...getDataAttributesSelector, ...geAttributesSelector);
		selectors.sort((a, b) => Number(b.uniquenessScore) - Number(a.uniquenessScore));

		selectors.push(...(genPnCSelectors ? genPnCSelectors : []));

		console.log('These are the selectors', selectors);
		console.log(selectors);

		// @ts-ignore
		return {
			mostUniqueSelector: selectors[0],
			list: [...idSelector, ...getDataAttributesSelector, ...geAttributesSelector, ...genPnCSelectors],
		} as UniqueSelectorResult;
	}
}

export default UniqueSelector;

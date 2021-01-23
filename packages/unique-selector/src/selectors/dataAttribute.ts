import { SELECTOR_TYPE } from '../constants';
import { SelectorData } from '../interfaces/result';
import { Map } from '../interfaces/common';
import { getQuerySelector, getUniqueScore } from '../utils';

/**
 * Returns data attribute map, value and uniqueness of HTML node
 * @param htmlNode
 * @param target
 * @return Array of SelectorData|null
 */
export const getDataAttribute = (htmlNode: HTMLElement, target: HTMLElement): SelectorData[] => {
	const nodeName = htmlNode.nodeName;
	const attributes = htmlNode.attributes;
	const length = attributes.length;
	const attributeList: Map = {};

	for (let i = 0; i < length; i++) {
		const attribute = attributes[i];
		const attributeName = attribute.nodeName;
		const attributeValue = attribute.nodeValue;

		// If data-id is not present, continue
		if (attributeName.indexOf('data-') === -1) continue;
		attributeList[attributeName] = attributeValue;
	}

	if (Object.keys(attributeList).length === -1) return [];

	return Object.keys(attributeList).map((attributeName) => {
		const attributeValue = attributeList[attributeName] as string;
		const querySelector = getQuerySelector(nodeName, attributeName, attributeValue);
		const uniqueScore = getUniqueScore(querySelector, target);

		return {
			type: SELECTOR_TYPE.DATA_ATTRIBUTE,
			value: querySelector,
			uniquenessScore: uniqueScore,
		};
	});
};

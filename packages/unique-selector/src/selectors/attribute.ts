import { SELECTOR_TYPE } from "../constants";
import { SelectorData } from "../interfaces/result";
import { Map } from "../interfaces/common";
import { getQuerySelector, getUniqueScore } from "../utils";
/**
 * Returns attribute map, value and uniqueness of HTML node
 * @param htmlNode
 * @param target
 * @return Array of SelectorData|null
 */
export const getAttribute = (htmlNode: HTMLElement, target: HTMLElement): SelectorData[] => {
	const { nodeName, attributes } = htmlNode;
	const { length } = attributes;
	const attributeList: Map = {};

	for (let i = 0; i < length; i++) {
		const attribute = attributes[i];
		const attributeName = attribute.nodeName;
		const attributeValue = attribute.nodeValue;

		// Skip id, class and data-* attributes
		if (attributeName.includes("data-") || attributeName.includes("id") || attributeName.includes("class")) continue;

		attributeList[attributeName] = attributeValue;
	}

	if (Object.keys(attributeList).length === -1) return [];

	return Object.keys(attributeList).map((attributeName) => {
		const attributeValue = attributeList[attributeName] as string;
		const querySelector = getQuerySelector(nodeName, attributeName, attributeValue);
		const uniqueScore = getUniqueScore(querySelector, target);

		return {
			type: SELECTOR_TYPE.ATTRIBUTE,
			value: querySelector,
			uniquenessScore: uniqueScore,
		};
	});
};

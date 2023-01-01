import { SELECTOR_TYPE } from "../constants";
import { SelectorData } from "../interfaces/result";
import { getUniqueScore } from "..//utils.ts";

/**
 * Returns id, value and uniqueness of HTML node
 * @param htmlNode
 * @param target
 * @return SelectorData
 */
export const getIDSelectors = (htmlNode: HTMLElement, target: HTMLElement): SelectorData[] => {
	const elementId = htmlNode.id;
	if (!elementId) return [];

	const querySelector = `#${elementId}`;
	const uniquenessScore = getUniqueScore(querySelector, target);

	return [
		{
			type: SELECTOR_TYPE.ID,
			value: querySelector,
			uniquenessScore,
		},
	];
};


export const getTextBasedSelector = (htmlNode: HTMLElement, target: HTMLElement): SelectorData[] => {
	const elementText = htmlNode.innerText;
	const hasLargeChild = Array.from(htmlNode.childNodes).length>3;
	if (!elementText && hasLargeChild ) return [];

	const querySelector = `text="${elementText}"`;
	const uniquenessScore = getUniqueScore(querySelector, target);

	return [
		{
			type: SELECTOR_TYPE.TEXT,
			value: querySelector,
			uniquenessScore,
		},
	];
};

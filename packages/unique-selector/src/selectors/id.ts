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

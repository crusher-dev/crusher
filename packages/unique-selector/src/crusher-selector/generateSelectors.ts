import { getXpath } from "./element";
import { generateSortedCueSets } from "./generateCueSets";
import { buildSelectorForCues, isSelectorMatch } from "./selectorEngine";
import { RankedSelector, Rect } from "./types";

export function* generateSelectors(
	target: HTMLElement,
	timeout = 1000,
	selectorCache?: Map<HTMLElement, RankedSelector>,
): Generator<RankedSelector, void, unknown> {
	const start = Date.now();

	const rectCache = new Map<HTMLElement, Rect>();

	if (selectorCache && selectorCache.has(target)) {
		const rankedSelector = selectorCache.get(target);
		const isMatch = isSelectorMatch(rankedSelector!.selector, target, rectCache);
		if (isMatch) {
			yield rankedSelector!;
		} else {
			// delete from cache if not a match
			selectorCache.delete(target);
		}
	}

	const cueSets = generateSortedCueSets(target);

	let count = 0;

	for (const cueSet of cueSets) {
		const selector = buildSelectorForCues(cueSet.cues);

		const isMatch = isSelectorMatch(selector, target, rectCache);
		if (isMatch) {
			const rankedSelector = { penalty: cueSet.penalty, selector };
			if (selectorCache) {
				selectorCache.set(target, rankedSelector);
			}
			yield rankedSelector;
			count += 1;
		}

		if (timeout > 0 && Date.now() - start > timeout) break;
	}

	if (count < 1) yield { penalty: 1000, selector: getXpath(target) };
}

export function getSelectors(target: HTMLElement, timeout = 1000, selectorCache?: Map<HTMLElement, RankedSelector>, limitSelectors = 10): Array<string> {
	if (["::before", "::after"].includes(target.tagName)) {
		target = target.parentElement;
	}

	const selectors = generateSelectors(target, timeout, selectorCache);

	const selectorList = [];
	let index = 0;
	for (const selector of selectors) {
		// take the first one
		if (index++ >= limitSelectors) {
			break;
		}

		selectorList.push(selector.selector);
	}

	return selectorList;
}

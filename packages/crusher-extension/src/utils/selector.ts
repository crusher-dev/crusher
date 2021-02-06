import { finder } from "@medv/finder";
import * as uniqueSelector2 from "unique-selector";
import { iSelectorInfo } from "../../../crusher-shared/types/selectorInfo";

const _uniqueSelector2 = new uniqueSelector2.default({});

function getXpathTo(element: HTMLElement): string | null {
	if (element === document.body) return element.tagName;
	if (!element.parentNode) return null;

	let ix = 0;
	const siblings = element.parentNode.childNodes;

	for (let i = 0; i < siblings.length; i++) {
		const sibling: ChildNode = siblings[i];
		if (sibling === element) {
			return `${getXpathTo(element.parentNode as HTMLElement)}/${
				element.tagName
			}[${ix + 1}]`;
		}
		if (
			sibling.nodeType === 1 &&
			(sibling as HTMLElement).tagName === element.tagName
		)
			ix++;
	}

	return null;
}

function getFinderSelector(elementNode: HTMLElement): string {
	const optimizedMinLength = elementNode.getAttribute("id") ? 2 : 10; // if the target has an id, use that instead of multiple frames selectors
	return finder(elementNode, { seedMinLength: 5, optimizedMinLength });
}

export function getSelectors(elementNode: HTMLElement): Array<iSelectorInfo> {
	const selectors = _uniqueSelector2.getUniqueSelector(elementNode);
	const xPathSelector = getXpathTo(elementNode);

	const out = [];
	out.push(...(selectors.list as Array<iSelectorInfo>));
	if (xPathSelector) {
		out.push({
			type: "xpath",
			value: getXpathTo(elementNode) as string,
			uniquenessScore: 1,
		});
	}

	return out;
}

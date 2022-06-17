// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/ban-ts-comment
// @ts-ignore
import * as uniqueSelector2 from "unique-selector";
import { iSelectorInfo } from "@shared/types/selectorInfo";

const _uniqueSelector2 = new uniqueSelector2.default({});

export function getXpathTo(element: HTMLElement): string | null {
	if (element === document.body) return element.tagName;
	if (!element.parentNode) return null;

	let ix = 0;
	const siblings = element.parentNode.childNodes;

	for (let i = 0; i < siblings.length; i++) {
		const sibling: ChildNode = siblings[i];
		if (sibling === element) {
			return `${getXpathTo(element.parentNode as HTMLElement)}/${element.tagName}[${ix + 1}]`;
		}
		if (sibling.nodeType === 1 && (sibling as HTMLElement).tagName === element.tagName) ix++;
	}

	return null;
}

export function getSelectors(elementNode: HTMLElement, useAdvancedSelector: boolean = false): Array<iSelectorInfo> {
	const selectors = _uniqueSelector2.getUniqueSelector(elementNode, useAdvancedSelector);
	const xPathSelector = getXpathTo(elementNode);

	const out: Array<any> = [];
	out.push(...(selectors.list as Array<iSelectorInfo>));
	if (xPathSelector) {
		out.push({
			type: "xpath",
			value: ("//" + getXpathTo(elementNode)) as string,
			uniquenessScore: 1,
		});
	}

	return out;
}

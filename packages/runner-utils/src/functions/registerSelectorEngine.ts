import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

function getCrusherSelectorEngine() {
	const getElementsByXPath = (xpath: string, parent: Node | null = null): Node[] => {
		const results = [];
		const query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (let i = 0, length = query.snapshotLength; i < length; ++i) {
			const item = query.snapshotItem(i);
			if (item) results.push(item);
		}
		return results;
	};

	const generateQuerySelector = (el: HTMLElement): string => {
		if (el.tagName.toLowerCase() == "html") return "HTML";
		let str = el.tagName;
		str += el.id != "" ? "#" + el.id : "";
		if (el.className) {
			const classes = el.className.split(/\s/);
			for (let i = 0; i < classes.length; i++) {
				str += "." + classes[i];
			}
		}
		return generateQuerySelector((el as any).parentNode) + " > " + str;
	};

	const getElementFromSelectorArr = (selectors: Array<iSelectorInfo>, root: Element | Document = document) => {
		for (const selector of selectors) {
			try {
				let selectedElement = null;
				if (selector.type === "xpath") {
					const elements = getElementsByXPath(selector.value);
					if (elements.length) selectedElement = elements[0];
				} else if (root.querySelector(selector.value)) {
					selectedElement = root.querySelector(selector.value)!;
				}
				if (selectedElement) {
					(selectedElement as any).selector = selector.value;
					(selectedElement as any).selectorType = selector.type;

					return selectedElement;
				}
			} catch {}
		}
		return null;
	};

	const getElementsFromSelectorArr = (selectors: Array<iSelectorInfo>, root: Element | Document = document) => {
		for (const selector of selectors) {
			try {
				let selectedElements = [];
				if (selector.type === "xpath") {
					const elements = getElementsByXPath(selector.value);
					if (elements.length) selectedElements = elements;
				} else if (root.querySelector(selector.value)) {
					selectedElements = new Array(root.querySelectorAll(selector.value)!);
				}
				selectedElements.map((selectedElement) => {
					(selectedElement as any).selector = selector.value;
					(selectedElement as any).selectorType = selector.type;

					return selectedElement;
				});
				if(selectedElements.length)
				return selectedElements;
			} catch {}
		}
		return null;
	};

	return {
		// Returns the first element matching given selector in the root's subtree.
		query(root: Element, selector: string) {
			const selectorArr = JSON.parse(decodeURIComponent(selector));
			const validElement = getElementFromSelectorArr(selectorArr);

			return  validElement;
		},

		// Returns all elements matching given selector in the root's subtree.
		queryAll(root: Element, selector: string) {
			const selectorArr = JSON.parse(decodeURIComponent(selector));
			const validElementsArr = getElementsFromSelectorArr(selectorArr);

			return validElementsArr;
		},
	};
}

export default getCrusherSelectorEngine;

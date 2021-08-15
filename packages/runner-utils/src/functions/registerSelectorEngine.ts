import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { Browser } from "playwright";
import { isWebpack } from "../utils/helper";

function getCrusherSelectorEngine() {
	const getElementsByXPath = (selector: string, root: Node | null = null): Node[] => {
		if (selector.startsWith("/")) selector = "." + selector;
		const result: Element[] = [];
		const document = root instanceof Document ? root : root.ownerDocument;
		if (!document) return result;
		const it = document.evaluate(selector, root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		for (let node = it.iterateNext(); node; node = it.iterateNext()) {
			if (node.nodeType === Node.ELEMENT_NODE) result.push(node as Element);
		}
		return result;
	};

	const generateQuerySelector = (el: HTMLElement): string => {
		if (!el) return null;
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

	const getElementFromSelectorArr = (selectorsEncoded: string, root: Element | Document = document) => {
		const selectorsData: { uuid: string; selectors: Array<iSelectorInfo> } = JSON.parse(decodeURIComponent(selectorsEncoded));
		const selectors = selectorsData.selectors;

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
					// @TODO: Find a better workaround for this
					(window as any)[selectorsData.uuid] = { selector: selector.value, selectorType: selector.type };
					return selectedElement;
				}
			} catch {}
		}
		return null;
	};

	const getElementsFromSelectorArr = (selectorsEncoded: string, root: Element | Document = document) => {
		const selectorsData: { uuid: string; selectors: Array<iSelectorInfo> } = JSON.parse(decodeURIComponent(selectorsEncoded));
		const selectors = selectorsData.selectors;

		for (const selector of selectors) {
			try {
				let selectedElements = null;
				if (selector.type === "xpath") {
					selectedElements = getElementsByXPath(selector.value);
				} else if (root.querySelector(selector.value)) {
					selectedElements = root.querySelectorAll(selector.value)!;
				}
				// @TODO: Find a better workaround for this
				(window as any)[selectorsData.uuid] = { selector: selector.value, selectorType: selector.type };
				if (selectedElements && selectedElements.length) return selectedElements;
			} catch {}
		}
		return [];
	};

	return {
		// Returns the first element matching given selector in the root's subtree.
		query(root: Element, selector: string) {
			const validElement = getElementFromSelectorArr(selector);

			return validElement;
		},

		// Returns all elements matching given selector in the root's subtree.
		queryAll(root: Element, selector: string) {
			const validElementsArr = getElementsFromSelectorArr(selector);

			return validElementsArr;
		},
	};
}

const requireFunction = isWebpack() ? __non_webpack_require__ : require;

function registerCrusherSelectorEngine(userPlaywrightChromium: boolean = false) {
	const playwright = requireFunction(userPlaywrightChromium ? "playwright-chromium" : "playwright");
	if (playwright.selectors._registrations.findIndex((selectorEngine) => selectorEngine.name === "crusher") === -1) {
		playwright.selectors.register("crusher", getCrusherSelectorEngine);
	}
}

export { registerCrusherSelectorEngine };

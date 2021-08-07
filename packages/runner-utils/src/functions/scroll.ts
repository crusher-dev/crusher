import { Page } from "playwright";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

export default async function scroll(page: Page, selectors: Array<iSelectorInfo>, scrollDeltaArr: Array<number>, isWindow: boolean = true): Promise<iSelectorInfo> {
	return page.evaluate(
		([scrollDeltaArr, selectorKeys, isWindow]: [number[], Array<iSelectorInfo>, boolean]) => {
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

			const selectedElement = getElementFromSelectorArr(selectorKeys);
			if (!selectedElement && !isWindow) throw new Error("No valid selector found");

			const scrollTo = function (element: HTMLElement, offset: number) {
				const fixedOffset = offset.toFixed();
				const onScroll = () => {
					if ((element as any).pageYOffset.toFixed() === fixedOffset) {
						element.removeEventListener("scroll", onScroll);
						return true;
					}
					return false;
				};

				element.addEventListener("scroll", onScroll);
				onScroll();
				element.scrollTo({
					top: offset,
					behavior: "smooth",
				});
			};

			const element = isWindow ? window : document.querySelector(selectedElement!.selector);

			for (let i = 0; i < scrollDeltaArr.length; i++) {
				if (scrollDeltaArr[i]) scrollTo(element as HTMLElement, scrollDeltaArr[i]);
			}

			return { type: selectedElement.selectorType, value: selectedElement.selector };
		},
		[scrollDeltaArr, selectors, isWindow],
	);
}

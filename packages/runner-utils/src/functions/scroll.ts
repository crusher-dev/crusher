import { Page } from "playwright";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

export default async function scroll(page: Page, selectors: Array<iSelectorInfo>, scrollDeltaArr: Array<number>, isWindow: boolean = true) {
	await page.evaluate(
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

			const getValidSelectorFromArr = (selectors: Array<iSelectorInfo>, root: Element | Document = document) => {
				for (const selector of selectors) {
					try {
						if (selector.type === "xpath") {
							const elements = getElementsByXPath(selector.value);
							if (elements.length) {
								const elementSelectorFromXpath = generateQuerySelector(elements[0] as HTMLElement);

								return { element: elements[0] as Element, selector: elementSelectorFromXpath };
							}
						} else if (root.querySelector(selector.value)) {
							return { element: root.querySelector(selector.value)!, selector: selector.value };
						}
					} catch {}
				}
				return null;
			};

			const selectorKeyInfo = getValidSelectorFromArr(selectorKeys);
			if (!selectorKeyInfo && !isWindow) throw new Error("No valid selector found");

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

			const element = isWindow ? window : document.querySelector(selectorKeyInfo!.selector);

			for (let i = 0; i < scrollDeltaArr.length; i++) {
				if (scrollDeltaArr[i]) scrollTo(element as HTMLElement, scrollDeltaArr[i]);
			}
		},
		[scrollDeltaArr, selectors, isWindow],
	);
}

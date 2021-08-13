import { ElementHandle, Page } from "playwright";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";

function scroll(scrollDeltaArr: Array<number>, element: Window | Element = null) {
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

	for (let i = 0; i < scrollDeltaArr.length; i++) {
		if (scrollDeltaArr[i]) scrollTo(element as HTMLElement, scrollDeltaArr[i]);
	}
}

export async function scrollElement(scrollDeltaArr: Array<number>, element: ElementHandle) {
	return element.evaluate(
		(on: Element, scrollDeltaArr: Array<any>) => {
			scroll(scrollDeltaArr, on);
		},
		[scrollDeltaArr],
	);
}

export async function scrollPage(scrollDeltaArr: Array<number>, page: Page) {
	return page.evaluate(
		(arg: Array<any>) => {
			scroll(scrollDeltaArr, window);
		},
		[scrollDeltaArr],
	);
}

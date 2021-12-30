import { ElementHandle, Page } from "playwright";

export function scrollElement(scrollDeltaArr: number[], element: ElementHandle) {
	return element.evaluate(
		(on: Element, args: any[]) => {
			function scroll(scrollDeltaArr: number[], element: Window | Element = null) {
				const scrollTo = function (element: HTMLElement, offset: number) {
					element.scrollTo({
						top: offset,
						behavior: "smooth",
					});
				};

				console.log("Scroll delta arr is", scrollDeltaArr);

				for (let i = 0; i < scrollDeltaArr.length; i++) {
					if (scrollDeltaArr[i]) scrollTo(element as HTMLElement, scrollDeltaArr[i]);
				}
			}

			scroll(args[0], on);
		},
		[scrollDeltaArr],
	);
}

export function scrollPage(scrollDeltaArr: number[], page: Page) {
	return page.evaluate(
		(arg: any[]) => {
			function scroll(scrollDeltaArr: number[], element: Window | Element = null) {
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

			scroll(arg[0], window);
		},
		[scrollDeltaArr],
	);
}

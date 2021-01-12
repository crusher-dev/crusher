import { Page } from "playwright";

export default async function scroll(
	page: Page,
	selector: string,
	scrollDeltaArr: Array<number>,
) {
	await page.evaluate(
		 ([scrollDeltaArr, selectorKey]: [number[], string]) => {
			const scrollTo =  function (element: HTMLElement, offset: number) {
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

			const element =
				selectorKey === "window" ? window : document.querySelector(selectorKey);

			for (let i = 0; i < scrollDeltaArr.length; i++) {
				 scrollTo(element as HTMLElement, scrollDeltaArr[i]);
			}
		},
		[scrollDeltaArr, selector],
	);
}

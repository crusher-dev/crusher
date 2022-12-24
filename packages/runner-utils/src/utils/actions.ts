import { BrowserContext, ElementHandle, Locator, Page } from "playwright";
import { iSelectorInfo } from "@crusher-shared/types/selectorInfo";
import { IFoundSelectorInfo, SelectorTypeEnum } from "@interfaces/index";
import { uuidv4 } from "@utils/helper";
import { iAction } from "@crusher-shared/types/action";

export const validActionTypeRegex = new RegExp(/(PAGE|ELEMENT|BROWSER)\_[A-Z0-1_]*$/);

export class ActionsUtils {
    static async getBrowserActions(actions: iAction[]) {
        return actions.filter((action: iAction) => {
            const matches = validActionTypeRegex.exec(action.type);
            return action && matches.length && matches[1] === "BROWSER";
        });
    }

    static async getMainActions(actions: iAction[]) {
        return actions.filter((action: iAction) => {
            const matches = validActionTypeRegex.exec(action.type);
            return action && matches[1] !== "BROWSER";
        });
    }

    static toCrusherSelectorsFormat(selectors: Array<iSelectorInfo>) {
        const id = uuidv4();
        const finalSelectors = selectors.filter((selector) => selector.uniquenessScore === 1);
        return { 
            value: `crusher=${encodeURIComponent(JSON.stringify({ selectors: finalSelectors, uuid: id })).replace(/'/g, "%27")}`,
            uuid: id
         };
    };

    static async handlePopup(page: Page, browserContext: BrowserContext) {
        page.on("popup", async (popup) => {
            const popupUrl = await popup.url();
            page.evaluate('window.location.href = "' + popupUrl + '"');
            const pages = await browserContext.pages();
            for (let i = 2; i < pages.length; i++) {
                await pages[i].close();
            }
        });
    }

    static async scrollElement(scrollDeltaArr: Array<number>, element: ElementHandle) {
        return element.evaluate(
            (on: Element, args: Array<any>) => {
                function scroll(scrollDeltaArr: Array<number>, element: Window | Element = null) {
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

    static async scrollPage(scrollDeltaArr: Array<number>, page: Page) {
        return page.evaluate(
            (arg: Array<any>) => {
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
    
                scroll(arg[0], window);
            },
            [scrollDeltaArr],
        );
    }
    
    static sleep(time: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    }

    static async type(elHandle: Locator, keyCodes: Array<string>) {
        for (let i = 0; i < keyCodes.length; i++) {
            await elHandle.first().press(keyCodes[i]);
        }
        return true;
    }    

    
    static async findSelectorFromPlaywright(page: Page, selectors: Array<iSelectorInfo>): Promise<IFoundSelectorInfo | boolean> {
        let playwrightOut, elementHandle;
        if (selectors[0].type == SelectorTypeEnum.PLAYWRIGHT) {
            try {
                elementHandle = await page.waitForSelector(selectors[0].value, { state: "visible" });
                playwrightOut = selectors[0].value;
            } catch (ex) {
                return false;
            }
            selectors.shift();
        }

        if (!elementHandle) return false;

        return { elementHandle, workingSelector: { value: playwrightOut, type: SelectorTypeEnum.PLAYWRIGHT } };
    }

    static async waitForSelectors(page: Page, selectors: Array<iSelectorInfo>): Promise<IFoundSelectorInfo | undefined> {
        const elementFromPlaywrightSelector = await this.findSelectorFromPlaywright(page, selectors);
        if (elementFromPlaywrightSelector) {
            return elementFromPlaywrightSelector as IFoundSelectorInfo;
        }

        const encodedSelector = this.toCrusherSelectorsFormat(selectors);
        const elementHandle = await page.waitForSelector(encodedSelector.value, { state: "visible" });
        const selectorInfo: { selector: string; selectorType: SelectorTypeEnum } = await elementHandle.evaluate(
            `const l = window["${encodedSelector.uuid}"]; delete window["${encodedSelector.uuid}"];  l;`,
        );

        return {
            elementHandle: elementHandle,
            workingSelector: {
                value: selectorInfo.selector,
                type: selectorInfo.selectorType,
            },
        };
    }

    static markTestFail(message: string, meta: any = {}): void {
        const customError = new Error(message);
        (customError as any).meta = meta;
    
        throw customError;
    }
}

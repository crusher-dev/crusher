import { BrowserContext, Page } from "playwright";

function handlePopup(page: Page, browserContext: BrowserContext) {
	page.on("popup", async (popup) => {
		const popupUrl = await popup.url();
		page.evaluate('window.location.href = "' + popupUrl + '"');
		const pages = await browserContext.pages();
		for (let i = 1; i < pages.length; i++) {
			await pages[i].close();
		}
	});
}

export { handlePopup };

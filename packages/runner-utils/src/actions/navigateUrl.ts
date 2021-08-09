import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";

async function goToUrl(page: Page, action: iAction) {
    const urlToGo = action.payload.meta.value;
    await page.goto(urlToGo);
}

module.exports = {
    name: "PAGE_NAVIGATE_URL",
    description: "Navigation to url",
    handler: goToUrl,
}
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { scroll } from "../functions/scroll";

async function waitForNavigation(page: Page, action: iAction) {    
    await page.waitForLoadState('networkidle');
}

module.exports = {
    name: "PAGE_WAIT_FOR_NAVIGATION",
    description: "Wait for navigation",
    handler: waitForNavigation,
}
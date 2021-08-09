import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { scroll } from "../functions/scroll";

async function scrollPage(page: Page, action: iAction) {
    const scrollDelta = action.payload.meta.value;

    await scroll(page, [], scrollDelta);
}

module.exports = {
    name: "PAGE_SCROLL",
    description: "Scroll on page",
    handler: scrollPage,
}
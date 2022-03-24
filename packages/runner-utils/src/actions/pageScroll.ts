import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { scrollPage } from "../functions/scroll";

async function scrollOnPage(page: Page, action: iAction) {
	const scrollDelta = action.payload.meta.value;
	console.log("Scrolling the page", [scrollDelta]);
	await scrollPage(scrollDelta, page);
}

module.exports = {
	name: ActionsInTestEnum.PAGE_SCROLL,
	description: "Scroll on page",
	actionDescriber: (action: iAction) => {
		return `Scroll on page`;
	},
	handler: scrollOnPage,
};

import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { sleep } from "../functions/sleep";

async function waitForNavigation(page: Page, action: iAction) {
	console.log("Waiting for navigation now...");
	if (action.payload.meta?.value) {
		await new Promise((resolve, reject) => {
			let time = 0;

			const interval = setInterval(async () => {
				if (time >= 5 * 1000) {
					clearInterval(interval);
					return resolve(true);
				}
				const pageUrl = await page.url();
				// Trim the slash at the end if any
				const pageUrlTrimmed = pageUrl.replace(/\/$/, "");
				const metaValue = action.payload.meta.value.replace(/\/$/, "");

				if (pageUrlTrimmed === metaValue) {
					clearInterval(interval);
					return resolve(true);
				}
				time += 500;
			}, 500);
		})
	} else {
		await sleep(2000);
	}
	console.log("Finsihed navigation");
}

module.exports = {
	name: ActionsInTestEnum.WAIT_FOR_NAVIGATION,
	description: "Wait for navigation",
	handler: waitForNavigation,
};

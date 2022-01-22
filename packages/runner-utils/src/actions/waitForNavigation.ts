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
				if (time >= 30 * 1000) {
					clearInterval();
					reject(new Error("Timeout"));
				}
				if (await page.url() === action.payload.meta.value) {
					resolve(true);
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

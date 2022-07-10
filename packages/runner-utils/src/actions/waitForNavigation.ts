import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { ExportsManager } from "../functions/exports";
import { CrusherSdk } from "../sdk/sdk";
import { sleep } from "../functions/sleep";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import template from "@crusher-shared/utils/templateString";
import { CommunicationChannel } from "../functions/communicationChannel";

async function waitForNavigation(
	page: Page,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	communicationChannel: CommunicationChannel,
	sdk: CrusherSdk | null,
	context: any,
) {
	console.log("Waiting for navigation now...");
	if (action.payload.meta?.value) {
		let url = template(action.payload.meta?.value, { ctx: context || {} });
		await new Promise((resolve, reject) => {
			let time = 0;

			const interval = setInterval(async () => {
				if (time >= 5 * 1000) {
					clearInterval(interval);
					return resolve(true);
				}
				const pageUrl = await page.url();

				const pageURL = new URL(pageUrl);
				pageURL.search = "";

				const metaValueUrl = new URL(url);
				metaValueUrl.search = "";
				// Trim the slash at the end if any
				const pageUrlTrimmed = pageURL.toString().replace(/\/$/, "");
				const metaValue = metaValueUrl.toString().replace(/\/$/, "");

				if (pageUrlTrimmed === metaValue) {
					clearInterval(interval);
					return resolve(true);
				}
				time += 500;
			}, 500);
		});
	} else {
		await sleep(2000);
	}
	console.log("Finsihed navigation");
}

module.exports = {
	name: ActionsInTestEnum.WAIT_FOR_NAVIGATION,
	description: "Wait for navigation",
	actionDescriber: (action: iAction) => {
		return `Wait for navigation to [${action.payload.meta?.value}]`;
	},
	handler: waitForNavigation,
};

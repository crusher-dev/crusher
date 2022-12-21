import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import template from "@crusher-shared/utils/templateString";
import { Page } from "playwright";
import { ExportsManager } from "../../../functions/exports";
import { CrusherSdk } from "../../../sdk/sdk";
import { CommunicationChannel } from "../../../functions/communicationChannel";

async function waitForSeconds(
	page: Page,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	communicationChannel: CommunicationChannel,
	sdk: CrusherSdk | null,
	context: any,
) {
	const timeout = template(action.payload.timeout, { ctx: context || {} });
	if (!timeout) return;
	await page.waitForTimeout(parseInt(timeout + "", 10) * 1000);
	return;
}

module.exports = {
	name: ActionsInTestEnum.WAIT,
	description: "Wait for seconds",
	actionDescriber: (action: iAction) => {
		return `Wait for ${action.payload.timeout} seconds`;
	},
	handler: waitForSeconds,
};

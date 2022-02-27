import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import template from "@crusher-shared/utils/templateString";
import { Page } from "playwright";
import { ExportsManager } from "../functions/exports";
import { CrusherSdk } from "../sdk/sdk";

async function waitForSeconds(page: Page, action: iAction, globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	sdk: CrusherSdk | null,
	context: any) {
	const timeout = template(action.payload.timeout, {ctx: context});
	if (!timeout) return;
	await page.waitForTimeout(parseInt(timeout + "", 10) * 1000);
	return;
}

module.exports = {
	name: ActionsInTestEnum.WAIT,
	description: "Wait for seconds",
	handler: waitForSeconds,
};

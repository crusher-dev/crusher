import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { CrusherSdk } from "../sdk/sdk";
import { ExportsManager } from "../functions/exports";
import template from "@crusher-shared/utils/templateString";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";

async function pressKey(element: Locator, workingSelector: any, action: iAction, 	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	sdk: CrusherSdk | null,
	context: any) {
	const keyToBePressed = template(action.payload.meta.value, {ctx: context});
	await element.press(keyToBePressed);
}

module.exports = {
	name: ActionsInTestEnum.PRESS,
	description: "Press key to element",
	handler: pressKey,
};

import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { Locator } from "playwright";
import { CrusherSdk } from "../sdk/sdk";
import { ExportsManager } from "../functions/exports";

async function clickOnElement(
	element: Locator,
	workingSelector: any,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
) {
	try {
		let pos = undefined;
		await (await element.elementHandle()).waitForElementState("visible");

		if (action.payload.meta.value?.mousePos) {
			const posObj = action.payload.meta.value.mousePos;
			if (posObj.x >= 0 && posObj.y >= 0) {
				const boundingBox = await element.boundingBox();
				pos = { x: boundingBox.width * posObj.x, y: boundingBox.height * posObj.y };
			}
		}
		await element.click({ timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined, position: pos });
	} catch (e) {
		if (!e.message.includes("selector resolved to hidden")) throw e;
		console.error("Error while clicking", e);
		await element.dispatchEvent("click");
	}
}

module.exports = {
	name: ActionsInTestEnum.CLICK,
	description: "Click on element",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Click element`;
		}
		return `Click [${action.payload.meta.elementDescription}]`;
	},
	handler: clickOnElement,
};

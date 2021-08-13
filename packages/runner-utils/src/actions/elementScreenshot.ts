import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { ElementHandle } from "playwright";
import { StorageManager } from "../functions/storage";
import { generateScreenshotName, uuidv4 } from "../utils/helper";

async function takeElementScreenshot(element: ElementHandle, action: iAction, globals: IGlobalManager, storageManager: StorageManager) {
	const screenshotBuffer = await element.screenshot();
	const screenshotName = generateScreenshotName(action.payload.selectors[0].value, uuidv4());
	const uploadedScreenshotUrl = await storageManager.uploadAsset(screenshotName, screenshotBuffer);

	return {
		customLogMessage: "Took screenshot of element",
		outputs: [
			{
				name: screenshotName,
				value: uploadedScreenshotUrl,
			},
		],
	};
}

module.exports = {
	name: ActionsInTestEnum.ELEMENT_SCREENSHOT,
	description: "Take element screenshot",
	handler: takeElementScreenshot,
};

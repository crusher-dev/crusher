import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { StorageManager } from "../../../functions/storage";
import { uuidv4 } from "../../../utils/helper";

async function takePageScreenshot(page: Page, step: iAction, globals: IGlobalManager, storageManager: StorageManager) {
	const screenshotBuffer = await page.screenshot({ type: "jpeg", quality: 70 });
	const screenshotName = `${uuidv4()}.png`;
	const uploadedScreenshotUrl = await storageManager.uploadAsset(screenshotName, screenshotBuffer);

	return {
		customLogMessage: "Took screenshot of current page",
		outputs: [
			{
				name: screenshotName,
				value: uploadedScreenshotUrl,
			},
		],
	};
}

module.exports = {
	name: ActionsInTestEnum.PAGE_SCREENSHOT,
	description: "Take page screenshot of page",
	actionDescriber: (action: iAction) => {
		return `Take screenshot of current page`;
	},
	handler: takePageScreenshot,
};

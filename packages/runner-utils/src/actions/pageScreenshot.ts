import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { StorageManager } from "../functions/storage";
import { generateScreenshotName, uuidv4 } from "../utils/helper";

async function takePageScreenshot(page: Page, step: iAction, globals: IGlobalManager, storageManager: StorageManager) {
    const screenshotBuffer = await page.screenshot();
    const screenshotName =  generateScreenshotName(await page.title(), uuidv4());
    const uploadedScreenshotUrl = await storageManager.uploadAsset(screenshotName, screenshotBuffer);

    return {
        customLogMessage: "Took screenshot of current page",
        outputs: [{
            name: screenshotName,
            value: uploadedScreenshotUrl,
        }],
    };
}

module.exports = {
	name: ActionsInTestEnum.PAGE_SCREENSHOT,
    description: "Take page screenshot of page",
    handler: takePageScreenshot,
}
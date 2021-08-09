import { Page } from "playwright";
import { uploadAsset } from "../functions/storage";
import { generateScreenshotName, uuidv4 } from "../utils/helper";

async function takePageScreenshot(page: Page, logStepResult: any) {
    const screenshotBuffer = await page.screenshot();
    const screenshotName =  generateScreenshotName(await page.title(), uuidv4());
    const uploadedScreenshotUrl = await uploadAsset(screenshotName, screenshotBuffer);

    return {
        customLogMessage: "Took screenshot of current page",
        outputs: [{
            name: screenshotName,
            value: uploadedScreenshotUrl,
        }],
    };
}

module.exports = {
    name: "PAGE_SCREENSHOT",
    description: "Take page screenshot of page",
    handler: takePageScreenshot,
}
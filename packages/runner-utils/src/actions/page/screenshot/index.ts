import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { uuidv4 } from "@utils/helper";
import { PageActionParams } from "@interfaces/actions";

async function takePageScreenshot(params: PageActionParams) {
	const { page } = params.playwright;
	const { storage } = params.services;

	const screenshotBuffer = await page.screenshot({ type: "jpeg", quality: 70 });
	const screenshotName = `${uuidv4()}.png`;
	const uploadedScreenshotUrl = await storage.uploadAsset(screenshotName, screenshotBuffer);

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

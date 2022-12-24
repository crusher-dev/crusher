import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { uuidv4 } from "@utils/helper";
import { ElementActionParams } from "@interfaces/actions";

async function takeElementScreenshot(params: ElementActionParams) {
	const { element } = params.playwright;
	const { currentStep } = params.test;
	const { storage } = params.services;

	const screenshotBuffer = await element.screenshot({
		timeout: currentStep.payload.timeout ? currentStep.payload.timeout * 1000 : undefined,
		type: "jpeg",
		quality: 70,
	});
	const screenshotName = `${uuidv4()}.jpeg`;
	const uploadedScreenshotUrl = await storage.uploadAsset(screenshotName, screenshotBuffer);

	return {
		customLogMessage: "Took screenshot of element",
		outputs: [
			{
				name: currentStep.name ? `${currentStep.name}.jpeg` : screenshotName,
				value: uploadedScreenshotUrl,
			},
		],
	};
}

module.exports = {
	name: ActionsInTestEnum.ELEMENT_SCREENSHOT,
	description: "Take element screenshot",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Screenshot element`;
		}
		return `Screenshot element [${action.payload.meta.elementDescription}]`;
	},
	handler: takeElementScreenshot,
};

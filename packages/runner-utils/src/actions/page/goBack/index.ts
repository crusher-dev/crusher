import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { PageActionParams } from "@interfaces/actions";

async function goBack(params: PageActionParams) {
	const { page } = params.playwright;
	const { currentStep } = params.test;

	try {
		await page.goBack({ waitUntil: "networkidle", timeout: currentStep.payload.timeout ? currentStep.payload.timeout * 1000 : undefined });
		await page.waitForLoadState("load");
		await page.waitForLoadState("domcontentloaded");
	} catch (ex) {
		console.log("Got error during navigation", ex);
	}
}

module.exports = {
	name: ActionsInTestEnum.BACK_PAGE,
	description: "Go back page",
	actionDescriber: (action: iAction) => {
		return `Go back page`;
	},
	handler: goBack,
};

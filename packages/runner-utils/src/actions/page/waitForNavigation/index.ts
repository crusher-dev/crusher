import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import template from "@crusher-shared/utils/templateString";
import { PageActionParams } from "@interfaces/actions";
import { ActionsUtils } from "@utils/actions";

async function waitForNavigation(params: PageActionParams) {
	const { page } = params.playwright;
	const { currentStep, context } = params.test;

	if (currentStep.payload.meta?.value) {
		let url = template(currentStep.payload.meta?.value, { ctx: context || {} });

		await page.waitForURL(url, { timeout: currentStep.payload.meta?.timeout || 30000 });
	} else {
		await ActionsUtils.sleep(2000);
	}
	console.log("Finished navigation");
}

module.exports = {
	name: ActionsInTestEnum.WAIT_FOR_NAVIGATION,
	description: "Wait for navigation",
	actionDescriber: (action: iAction) => {
		return `Wait for navigation to [${action.payload.meta?.value}]`;
	},
	handler: waitForNavigation,
};

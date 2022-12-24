import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import template from "@crusher-shared/utils/templateString";
import { PageActionParams } from "@interfaces/actions";

async function waitForSeconds(params: PageActionParams) {
	const { page } = params.playwright;
	const { currentStep, context } = params.test;

	const timeout = template(currentStep.payload.timeout, { ctx: context || {} });
	if (!timeout) return;
	await page.waitForTimeout(parseInt(timeout + "", 10) * 1000);
	return;
}

module.exports = {
	name: ActionsInTestEnum.WAIT,
	description: "Wait for seconds",
	actionDescriber: (action: iAction) => {
		return `Wait for ${action.payload.timeout} seconds`;
	},
	handler: waitForSeconds,
};

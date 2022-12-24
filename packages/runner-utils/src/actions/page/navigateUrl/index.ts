import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import template from "@crusher-shared/utils/templateString";
import { PageActionParams } from "@interfaces/actions";

async function goToUrl(params: PageActionParams) {
	const { page } = params.playwright;
	const { currentStep, context } = params.test;
	const urlToGo = template(currentStep.payload.meta.value, { ctx: context || {} });
	try {
		await page.goto(urlToGo, { waitUntil: "load", timeout: currentStep.payload.timeout ? currentStep.payload.timeout * 1000 : undefined });
	} catch (ex) {
		const regex = new RegExp(/Timeout [\d]*ms exceeded/g);
		if(ex.message.match(regex)) {
			console.log("Got error during navigation", ex);
		} else {
			console.log("Got error during navigation", ex);
			throw ex;
		}
	}
}

module.exports = {
	name: ActionsInTestEnum.NAVIGATE_URL,
	description: "Navigation to url",
	actionDescriber: (action: iAction) => {
		return `Navigate to [${action.payload.meta.value}]`;
	},
	handler: goToUrl,
};

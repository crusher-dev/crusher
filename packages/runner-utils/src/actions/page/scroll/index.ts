import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { ActionsUtils } from '@utils/actions';
import { PageActionParams } from "@interfaces/actions";

async function scrollOnPage(params: PageActionParams) {
	const { currentStep } = params.test;
	const { page } = params.playwright;

	const scrollDelta = currentStep.payload.meta.value;
	await ActionsUtils.scrollPage(scrollDelta, page);
}

module.exports = {
	name: ActionsInTestEnum.PAGE_SCROLL,
	description: "Scroll on page",
	actionDescriber: (action: iAction) => {
		return `Scroll on page`;
	},
	handler: scrollOnPage,
};

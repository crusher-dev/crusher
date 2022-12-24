import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { ElementActionParams } from "@interfaces/actions";
import { ActionsUtils } from "@utils/actions";

async function scrollOnElement(params: ElementActionParams) {
	const { element } = params.playwright;
	const { currentStep } = params.test;

	const scrollDelta = currentStep.payload.meta.value;
	await ActionsUtils.scrollElement(
		scrollDelta,
		await element.elementHandle({
			timeout: currentStep.payload.timeout ? currentStep.payload.timeout * 1000 : undefined
		})
	);
}

module.exports = {
	name: ActionsInTestEnum.ELEMENT_SCROLL,
	description: "Scroll on element",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Scroll on element`;
		}

		return `Scroll on element ${action.payload.meta.elementDescription}`;
	},
	handler: scrollOnElement,
};

import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { ElementActionParams } from "@interfaces/actions";

async function assertElementVisibility(params: ElementActionParams) {
	const { element } = params.playwright;
	await (await element.elementHandle()).waitForElementState("visible");
}

module.exports = {
	name: ActionsInTestEnum.ASSERT_ELEMENT_VISIBILITY,
	description: "Asserting element visibility",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Assert element visibility`;
		}
		return `Assert [${action.payload.meta.elementDescription}] visibility`;
	},
	handler: assertElementVisibility,
};

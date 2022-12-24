import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { ElementActionParams } from "@interfaces/actions";

async function clickOnElement(
	params: ElementActionParams
) {
	const { element } = params.playwright;
	const { currentStep } = params.test;

	try {
		let pos = undefined;
		await element.waitFor({state: "visible"});

		if (currentStep.payload.meta.value?.mousePos) {
			const posObj = currentStep.payload.meta.value.mousePos;
			if (posObj.x >= 0 && posObj.y >= 0) {
				const boundingBox = await element.boundingBox();
				if(!boundingBox) throw new Error("selector resolved to hidden. Can't get bounding box");
				pos = { x: boundingBox.width * posObj.x, y: boundingBox.height * posObj.y };
			}
		}
		await element.click({ timeout: currentStep.payload.timeout ? currentStep.payload.timeout * 1000 : undefined, position: pos });
	} catch (e) {
		if (!e.message.includes("selector resolved to hidden")) throw e;
		console.error("Error while clicking", e);
		await element.dispatchEvent("click");
	}
}

module.exports = {
	name: ActionsInTestEnum.CLICK,
	description: "Click on element",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Click element`;
		}
		return `Click [${action.payload.meta.elementDescription}]`;
	},
	handler: clickOnElement,
};

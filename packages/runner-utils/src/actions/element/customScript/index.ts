
import { ElementHandle } from "playwright";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { ExportsManager } from "@libs/exportManager";
import { ActionsUtils } from "@utils/actions";
import { ElementActionParams } from "@interfaces/actions";

const runScriptOnElement = (script: string, elHandle: ElementHandle, exportsManager: ExportsManager): Promise<boolean> => {
	return new Function(
		"exports",
		"require",
		"module",
		"__filename",
		"__dirname",
		"script",
		"elHandle",
		"exportsManager",
		`return new Promise(async function (resolve, reject) {
				    try{
				        const scriptFunction = ${script};
								const result = await elHandle.evaluate(scriptFunction, [exportsManager]);
				        resolve(result);
				    } catch(err){
				      reject(err);
				    }
				});`,
	)(exports, require, module, __filename, __dirname, script, elHandle, exportsManager);
};

async function runCustomScriptOnElement(
	params: ElementActionParams
) {
	const { element } = params.playwright;
	const { currentStep } = params.test;

	const customScript = currentStep.payload.meta.script;
	const actionResult = await runScriptOnElement(
		customScript,
		await element.elementHandle({ timeout: currentStep.payload.timeout ? currentStep.payload.timeout * 1000 : undefined }),
		params.services.exports,
	);

	if (!actionResult) ActionsUtils.markTestFail("Failed according to custom script assertions");
}

module.exports = {
	name: ActionsInTestEnum.CUSTOM_ELEMENT_SCRIPT,
	description: "Custom script on element",
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Run Custom script on element`;
		}
		return `Run custom script on [${action.payload.meta.elementDescription}]`;
	},
	handler: runCustomScriptOnElement,
};

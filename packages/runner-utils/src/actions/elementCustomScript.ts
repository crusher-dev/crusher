import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Locator, ElementHandle } from "playwright";
import { markTestFail } from "../utils/helper";

const runScriptOnElement = (script: string, elHandle: ElementHandle): Promise<boolean> => {
	return new Function(
		"exports",
		"require",
		"module",
		"__filename",
		"__dirname",
		"script",
		"elHandle",
		`return new Promise(async function (resolve, reject) {
				    try{
				        const scriptFunction = ${script};
								const result = await elHandle.evaluate(scriptFunction);
				        resolve(result);
				    } catch(err){
				      reject(err);
				    }
				});`,
	)(exports, require, module, __filename, __dirname, script, elHandle);
};

async function runCustomScriptOnElement(element: Locator, workingSelector: any, action: iAction) {
	const customScript = action.payload.meta.script;
	const actionResult = await runScriptOnElement(customScript, await element.elementHandle({timeout: action.payload.timeout ? action.payload.timeout : undefined}));

	if (!actionResult) markTestFail("Failed according to custom script assertions");
}

module.exports = {
	name: ActionsInTestEnum.CUSTOM_ELEMENT_SCRIPT,
	description: "Custom script on element",
	handler: runCustomScriptOnElement,
};

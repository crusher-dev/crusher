import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { ElementHandle } from "playwright";
import { markTestFail } from "src/utils/helper";

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
				        console.log(scriptFunction);
				        resolve(await scriptFunction(elHandle));
				    } catch(err){
				      reject(err);
				    }
				});`,
	)(exports, require, module, __filename, __dirname, script, elHandle);
};

async function runCustomScriptOnElement(element: ElementHandle, action: iAction) {
    const customScript = action.payload.meta.script;
    const actionResult = await runScriptOnElement(customScript, element);

    if(!actionResult) markTestFail("Failed according to custom script assertions");
}

module.exports = {
    name: ActionsInTestEnum.CUSTOM_ELEMENT_SCRIPT,
    description: "Custom script on element",
    handler: runCustomScriptOnElement,
}
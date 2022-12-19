import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { Locator, ElementHandle } from "playwright";
import { ExportsManager } from "src/functions/exports";
import { StorageManager } from "src/functions/storage";
import { markTestFail } from "src/utils/helper";

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
	element: Locator,
	workingSelector: any,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
) {
	const customScript = action.payload.meta.script;
	const actionResult = await runScriptOnElement(
		customScript,
		await element.elementHandle({ timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined }),
		exportsManager,
	);

	if (!actionResult) markTestFail("Failed according to custom script assertions");
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

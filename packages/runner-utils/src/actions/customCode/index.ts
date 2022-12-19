import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { ExportsManager } from "@functions/exports";
import { StorageManager } from "@functions/storage";
import { CrusherSdk } from "@sdk/sdk";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import expect from "expect";
import * as modules from "@utils/modules";
import { CommunicationChannel } from "@functions/communicationChannel";
import * as util from "@babel/cli/lib/babel/util";
import { NodeExtraModules } from "@sdk/modules.extra";

async function executeCustomCode(
	page: Page,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	communcationChannel: CommunicationChannel,
	sdk: CrusherSdk | null,
	context: any,
) {
	const customScriptFunction = action.payload.meta.script;

	const crusherSdk = sdk ? sdk : new CrusherSdk(page, exportsManager, storageManager, communcationChannel);

	let result = null;

	const res = await util.transformRepl("main.js", customScriptFunction, {
		cwd: eval(`__dirname`),
		plugins: [
			require("@babel/plugin-transform-typescript")
		]
	});


	const customRequire = (moduleName: string) => {
		try {
			// @ts-ignore
			return NodeExtraModules.require(moduleName);
		} catch(err) {
			//@ts-ignore
			return __non_webpack_require__(moduleName);
		}
	};
	
	result = await new Function(
		"exports",
		"require",
		"module",
		"__filename",
		"__dirname",
		"crusherSdk",
		"ctx",
		"expect",
		"modules",
		`${res.code} if(typeof validate === "function") { return validate(crusherSdk, ctx); } return true;`,
	)(
		exports,
		customRequire,
		module,
		__filename,
		__dirname,
		crusherSdk,
		context,
		expect,
		modules,
	);

	return {
		customLogMessage: result ? "Executed custom code" : "Error executing custom code",
		result: result,
		outputs: result && result.outputs ? result.outputs : [],
	};
}

module.exports = {
	name: ActionsInTestEnum.CUSTOM_CODE,
	description: "Executing custom code",
	actionDescriber: (action: iAction) => {
		return `Run custom code`;
	},
	handler: executeCustomCode,
};

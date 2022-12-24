import expect from "expect";
import * as util from "@babel/cli/lib/babel/util";
import * as modules from "@utils/modules";

import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { CrusherSdk } from "@libs/sdk";
import { NodeExtraModules } from "@libs/sdk/modules.extra";
import { PageActionParams } from "@interfaces/actions";

async function executeCustomCode(
	params: PageActionParams
) {
	const { playwright, test, sdk } = params;
	const { page } = playwright;
	const services = params.services;

	const customScriptFunction = test.currentStep.payload.meta.script;

	const crusherSdk = sdk ? sdk : new CrusherSdk(page, services.exports, services.storage, services.runnerCommunicationChannel);

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
		test.context,
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

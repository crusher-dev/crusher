import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { ExportsManager } from "../functions/exports";
import { StorageManager } from "../functions/storage";
import { CrusherSdk } from "../sdk/sdk";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import template from "@crusher-shared/utils/templateString";
import expect from "expect";
import * as modules from "../utils/modules";

async function executeCustomCode(
	page: Page,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
	sdk: CrusherSdk | null,
	context: any
) {
	const customScriptFunction = action.payload.meta.script;

	const crusherSdk = sdk ? sdk : new CrusherSdk(page, exportsManager, storageManager);

	let result = null;
	result = await new Function(
		"exports",
		"require",
		"module",
		"__filename",
		"__dirname",
		"crusherSdk",
		"context",
		"expect",
		"modules",
		`${customScriptFunction} return validate(crusherSdk, context);`,
	)(exports, typeof __webpack_require__ === "function" ? __non_webpack_require__ : require, module, __filename, __dirname, crusherSdk, context, expect, modules);

	return {
		customLogMessage: result ? "Executed custom code" : "Error executing custom code",
		result: result,
		outputs: result && result.outputs ? result.outputs : [],
	};
}

module.exports = {
	name: ActionsInTestEnum.CUSTOM_CODE,
	description: "Executing custom code",
	handler: executeCustomCode,
};

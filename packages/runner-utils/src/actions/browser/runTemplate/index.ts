import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Browser, Page } from "playwright";
import { CrusherRunnerActions } from "~/index";

async function runTemplate(
	page: Page,
	action: iAction,
	_,
	__,
	___,
	____,
	_____,
	context: any,
	browser: Browser,
	runActions: (...params: Parameters<CrusherRunnerActions["runActions"]>) => ReturnType<CrusherRunnerActions["runActions"]>,
) {
	console.log("Running template");

	const actions = action.payload.meta.actions;
	return runActions(actions, browser, page, null, false);
}

module.exports = {
	name: ActionsInTestEnum.RUN_TEMPLATE,
	description: "Run a template",
	actionDescriber: (action: iAction) => {
		return `Run a template`;
	},
	handler: runTemplate,
};

import { iAction } from "../../crusher-shared/types/action";
import { ACTIONS_IN_TEST } from "../../crusher-shared/constants/recordedActions";
import { Parser } from "./parser";

interface iCodeGeneratorOptions {
	isLiveLogsOn?: boolean;
	shouldRecordVideo?: boolean;
}

export class CodeGenerator {
	options: iCodeGeneratorOptions;
	actionsMap: Array<{
		type: ACTIONS_IN_TEST;
		code: Array<string> | string;
	}>;

	constructor(options: iCodeGeneratorOptions = {}) {
		this.options = options;
	}

	parse(actions: Array<iAction>) {
		const parser = new Parser(actions);
		parser.parseActions();
		return parser.getCode();
	}
}

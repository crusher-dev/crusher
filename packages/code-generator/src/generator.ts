import { iAction } from "../../crusher-shared/types/action";
import { ACTIONS_IN_TEST } from "../../crusher-shared/constants/recordedActions";
import { Parser } from "./parser";
import { BROWSER } from "../../crusher-shared/types/browser";

interface iCodeGeneratorOptions {
	isLiveLogsOn?: boolean;
	shouldRecordVideo?: boolean;
	isHeadless?: boolean;
	browser?: BROWSER;
	assetsDir?: string;
	usePlaywrightChromium?: boolean;
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
		const parser = new Parser({
			actions,
			isLiveRecording: this.options.shouldRecordVideo,
			shouldLogSteps: this.options.isLiveLogsOn,
			browser: this.options.browser,
			isHeadless: this.options.isHeadless,
			assetsDir: this.options.assetsDir,
			usePlaywrightChromium: this.options.usePlaywrightChromium,
		});
		parser.parseActions();
		return parser.getCode();
	}
}

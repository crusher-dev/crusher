import { iAction } from "../../crusher-shared/types/action";
import { ACTIONS_IN_TEST } from "../../crusher-shared/constants/recordedActions";
import { Parser } from "./parser";
import { BrowserEnum } from "../../crusher-shared/types/browser";

interface iCodeGeneratorOptions {
	shouldRecordVideo?: boolean;
	defaultBrowserLaunchOptions?: any;
	browser?: BrowserEnum;
	assetsDir?: string;
	usePlaywrightChromium?: boolean;
	videoSavePath: string;
}

export class CodeGenerator {
	options: iCodeGeneratorOptions;
	actionsMap: Array<{
		type: ACTIONS_IN_TEST;
		code: Array<string> | string;
	}>;

	constructor(options: iCodeGeneratorOptions) {
		this.options = options;
	}

	getConfig(): iCodeGeneratorOptions {
		return this.options;
	}

	getCode(actions: Array<iAction>): Promise<string> {
		const parser = new Parser({
			actions,
			shouldRecordVideo: this.options.shouldRecordVideo,
			browser: this.options.browser,
			assetsDir: this.options.assetsDir,
			shouldUsePlaywrightChromium: this.options.usePlaywrightChromium,
			videoSavePath: this.options.videoSavePath,
			defaultBrowserLaunchOptions: {
				headless: true,
				args: ["--disable-shm-usage", "--disable-gpu"],
				...this.options.defaultBrowserLaunchOptions,
			},
		});

		return parser.getCode();
	}
}

import { iAction } from "../../crusher-shared/types/action";
import { ActionsInTestEnum } from "../../crusher-shared/constants/recordedActions";
import { Parser } from "./parser";
import { BrowserEnum } from "../../crusher-shared/types/browser";

interface iCodeGeneratorOptions {
	shouldRecordVideo?: boolean;
	defaultBrowserLaunchOptions?: any;
	browser?: BrowserEnum;
	assetsDir?: string;
	usePlaywrightChromium?: boolean;
	videoSavePath: string;
	turnOnTracing?: boolean;
	recordHarPath?: string;
	tracePath?: string;
	persistentContextDir?: string;
	proxyUrlsMap?: { [key: string]: { tunnel: string; intercept: string | { regex: string } } };
}

export class CodeGenerator {
	options: iCodeGeneratorOptions;
	actionsMap: Array<{
		type: ActionsInTestEnum;
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
			turnOnTracing: this.options.turnOnTracing,
			tracePath: this.options.tracePath,
			proxyUrlsMap: this.options.proxyUrlsMap,
			defaultBrowserLaunchOptions: {
				headless: true,
				args: ["--disable-shm-usage", "--disable-gpu"],
				...this.options.defaultBrowserLaunchOptions,
			},
			recordHarPath: this.options.recordHarPath,
			persistentContextDir: this.options.persistentContextDir,
		});

		return parser.getCode();
	}
}

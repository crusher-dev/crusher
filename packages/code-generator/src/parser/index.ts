import { iAction } from "crusher-shared/types/action";
import { BrowserEnum } from "crusher-shared/types/browser";
import { ParserChecks } from "./preChecks";
import * as ejs from "ejs";
import * as path from "path";
interface IParserOptions {
	shouldRecordVideo?: boolean;
	shouldUsePlaywrightChromium?: boolean;
	browser: BrowserEnum;
	actions: Array<iAction>;
	assetsDir: string;
	videoSavePath: string;
	defaultBrowserLaunchOptions: any;
}

class Parser {
	shouldRecordVideo: boolean;
	shouldUsePlaywrightChromium: boolean;
	actionsList: iAction[];
	browser: BrowserEnum;
	assetsDir: string;
	defaultBrowserLaunchOptions: any;
	videoSavePath: string;

	constructor(options: IParserOptions) {
		this.shouldRecordVideo = !!options.shouldRecordVideo;
		this.shouldUsePlaywrightChromium = !!options.shouldUsePlaywrightChromium;
		this.actionsList = options.actions;
		this.browser = options.browser;
		this.assetsDir = options.assetsDir;
		this.defaultBrowserLaunchOptions = options.defaultBrowserLaunchOptions;
		this.videoSavePath = options.videoSavePath;

		ParserChecks.validateActions(this.actionsList);
	}

	getCode(): Promise<string> {
		return ejs.renderFile(path.join(__dirname, "./code.template.ejs"), {
			shouldRecordVideo: this.shouldRecordVideo,
			runnerUtilsPackagePath: "crusher-runner-utils",
			baseAssetsPath: this.assetsDir,
			videoSavePath: this.videoSavePath,
			defaultBrowserLaunchOptions: this.defaultBrowserLaunchOptions,
			usePlaywrightChromium: this.shouldUsePlaywrightChromium,
			browserName: this.browser,
			defaultBrowserContextOptions: { defaultNavigationTimeout: 15000, defaultTimeout: 5000, recordVideo: { dir: this.videoSavePath } },
			actions: this.actionsList,
		});
	}
}

export { Parser };

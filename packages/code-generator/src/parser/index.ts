import { iAction } from "crusher-shared/types/action";
import { BrowserEnum } from "crusher-shared/types/browser";
import { ParserChecks } from "./preChecks";
import * as ejs from "ejs";
import * as path from "path";
import * as fs from "fs";
interface IParserOptions {
	shouldRecordVideo?: boolean;
	shouldUsePlaywrightChromium?: boolean;
	browser: BrowserEnum;
	actions: Array<iAction>;
	assetsDir: string;
	videoSavePath: string;
	defaultBrowserLaunchOptions: any;
	turnOnTracing?: boolean;
	tracePath?: string;
	recordHarPath?: string;
	persistentContextDir?: string;
	proxyUrlsMap?: { [key: string]: { tunnel: string; intercept: string | { regex: string } } };
}

class Parser {
	shouldRecordVideo: boolean;
	shouldUsePlaywrightChromium: boolean;
	actionsList: iAction[];
	browser: BrowserEnum;
	assetsDir: string;
	defaultBrowserLaunchOptions: any;
	videoSavePath: string;
	isTracingOn: boolean;
	tracePath: string;
	recordHarPath: string;
	persistentContextDir: string | null;
	proxyUrlsMap: { [key: string]: { tunnel: string; intercept: string | { regex: string } } } = {};

	constructor(options: IParserOptions) {
		this.shouldRecordVideo = !!options.shouldRecordVideo;
		this.shouldUsePlaywrightChromium = !!options.shouldUsePlaywrightChromium;
		this.actionsList = options.actions;
		this.browser = options.browser;
		this.assetsDir = options.assetsDir;
		this.defaultBrowserLaunchOptions = options.defaultBrowserLaunchOptions;
		this.videoSavePath = options.videoSavePath;
		this.isTracingOn = !!options.turnOnTracing;
		this.tracePath = options.tracePath ? options.tracePath : "trace.zip";
		this.persistentContextDir = options.persistentContextDir;
		this.proxyUrlsMap = options.proxyUrlsMap;
		this.recordHarPath = options.recordHarPath;

		ParserChecks.validateActions(this.actionsList);
	}

	getCode(): Promise<string> {
		return ejs.renderFile(path.join(__dirname, "./code.template.ejs"), {
			shouldRecordVideo: this.shouldRecordVideo,
			runnerUtilsPackagePath: fs.existsSync("./crusher-runner-utils.ts/index.js") ? "./crusher-runner-utils.ts/index.js" : "crusher-runner-utils",
			baseAssetsPath: this.assetsDir,
			videoSavePath: this.videoSavePath,
			defaultBrowserLaunchOptions: this.defaultBrowserLaunchOptions,
			usePlaywrightChromium: this.shouldUsePlaywrightChromium,
			browserName: this.browser,
			isTracingOn: this.isTracingOn,
			tracePath: this.tracePath,
			defaultBrowserContextOptions: {
				defaultNavigationTimeout: 30000,
				defaultTimeout: 15000,
				recordVideo: this.shouldRecordVideo ? { dir: this.videoSavePath } : undefined,
				recordHar: this.recordHarPath ? { path: this.recordHarPath } : undefined,
			},
			actions: this.actionsList,
			isPersistentContext: !!this.persistentContextDir,
			persistentContextDir: this.persistentContextDir,
			proxyUrlsMap: this.proxyUrlsMap || {},
		});
	}
}

export { Parser };

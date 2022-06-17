import { CodeGenerator } from "@generator/src/generator";
import { isOpenSource } from "@shared/utils/helper";
import { iAction } from "@shared/types/action";
import { ITestRunConfig } from "@shared/types/runner/jobRunRequest";
import * as path from "path";
import { ActionStatusEnum, IRunnerLogManagerInterface } from "@shared/lib/runnerLog/interface";
import { IStorageManager } from "@shared/lib/storage/interface";
import { IGlobalManager } from "@shared/lib/globals/interface";
import { BrowserEnum, PlaywrightBrowserMap } from "@shared/types/browser";
import * as fs from "fs";
import { IActionResultItem } from "@shared/types/common/general";
import { IExportsManager } from "@shared/lib/exports/interface";
import { zipDirectory } from "@src/util/helper";
import { CommunicationChannel } from "crusher-runner-utils";

const TEST_ACTIONS_RESULT_KEY = "TEST_RESULT";
export class CodeRunnerService {
	codeGenerator: CodeGenerator;
	actions: Array<iAction>;
	runnerConfig: ITestRunConfig;

	logManager: IRunnerLogManagerInterface;
	storageManager: IStorageManager;
	globalManager: IGlobalManager;
	exportsManager: IExportsManager;
	communicationChannel: typeof CommunicationChannel;
	persistentContextDir: string | null;
	context: any;

	constructor(
		actions: Array<iAction>,
		runnerConfig: ITestRunConfig,
		storageManager: IStorageManager,
		logManager: IRunnerLogManagerInterface,
		globalManager: IGlobalManager,
		exportsManager: IExportsManager,
		communicationChannel: typeof CommunicationChannel,
		identifer: string,
		persistentContextDir: string | null = null,
		context: any = {},
	) {
		this.codeGenerator = new CodeGenerator({
			shouldRecordVideo: isOpenSource() ? false : runnerConfig.shouldRecordVideo,
			usePlaywrightChromium: isOpenSource(),
			browser: PlaywrightBrowserMap[runnerConfig.browser] as any,
			assetsDir: identifer,
			videoSavePath: `/tmp/crusher/${identifer}`,
			defaultBrowserLaunchOptions: {
				headless: true,
				args: runnerConfig.browser === BrowserEnum.SAFARI ? [] : ["--disable-dev-shm-usage", "--disable-gpu"],
				executablePath: isOpenSource() ? process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH : undefined,
			},
			proxyUrlsMap: runnerConfig.proxyUrlsMap || {},
			persistentContextDir: persistentContextDir,
		});
		this.actions = actions;
		this.runnerConfig = runnerConfig;

		this.storageManager = storageManager;
		this.logManager = logManager;
		this.globalManager = globalManager;
		this.exportsManager = exportsManager;
		this.communicationChannel = communicationChannel;
		this.persistentContextDir = persistentContextDir;
		this.context = context;
	}

	getCompleteActionsResult(runnerActionResults: Array<IActionResultItem>): Array<IActionResultItem> {
		return this.actions.map((action, index) => {
			if (!runnerActionResults[index]) {
				return {
					actionType: action.type,
					status: ActionStatusEnum.FAILED,
					message: "Never reached this action",
					meta: {},
				};
			}
			return runnerActionResults[index];
		});
	}

	async runTest(): Promise<{
		recordedRawVideo: string;
		hasPassed: boolean;
		error: (Error & { isStalled?: boolean }) | undefined;
		actionResults: any;
		persistenContextZipURL: string | null;
	}> {
		const code = await this.codeGenerator.getCode(this.actions);
		let error, recordedRawVideoUrl;
		try {
			await new Function(
				"exports",
				"require",
				"module",
				"__filename",
				"__dirname",
				"logManager",
				"storageManager",
				"globalManager",
				"exportsManager",
				"communicationChannel",
				"context",
				`async function f(){ ${code} } return f();`,
			)(
				exports,
				typeof __webpack_require__ === "function" ? __non_webpack_require__ : require,
				module,
				__filename,
				__dirname,
				this.logManager,
				this.storageManager,
				this.globalManager,
				this.exportsManager,
				this.communicationChannel,
				this.context,
				process.env.GLOBAL_NODE_MODULES_PATH,
			);
		} catch (err) {
			console.error(err);
			error = err;
		}

		const codeGeneratorConfig = this.codeGenerator.getConfig();
		const recordedVideoRawPath = this.globalManager.get("recordedVideoPath");
		if (codeGeneratorConfig.shouldRecordVideo && this.runnerConfig.browser === BrowserEnum.CHROME && recordedVideoRawPath) {
			if (fs.existsSync(recordedVideoRawPath)) {
				const videoBuffer = fs.readFileSync(recordedVideoRawPath);
				fs.unlinkSync(recordedVideoRawPath);
				recordedRawVideoUrl = await this.storageManager.uploadBuffer(
					videoBuffer,
					path.join("00_temp_folder/", codeGeneratorConfig.assetsDir, "video.mp4.raw"),
				);
			}
		}

		const testActionResults = this.globalManager.get(TEST_ACTIONS_RESULT_KEY);

		let persistenContextZipURL = null;
		if (this.persistentContextDir) {
			const persistenContextZipBuffer = await zipDirectory(this.persistentContextDir);
			const persistentContextDirName = path.basename(this.persistentContextDir);

			persistenContextZipURL = await this.storageManager.uploadBuffer(
				persistenContextZipBuffer,
				path.join("00_temp_folder/", codeGeneratorConfig.assetsDir, `${persistentContextDirName}.zip`),
			);
		}

		return {
			recordedRawVideo: recordedRawVideoUrl,
			hasPassed: !error ? true : error.isStalled ? true : false,
			error: error,
			actionResults: this.getCompleteActionsResult(testActionResults),
			persistenContextZipURL,
		};
	}
}

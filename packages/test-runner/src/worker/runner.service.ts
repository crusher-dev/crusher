import { CodeGenerator } from "@generator/src/generator";
import { isOpenSource } from "@shared/utils/helper";
import { iAction } from "@shared/types/action";
import { ITestRunConfig } from "@shared/types/runner/jobRunRequest";
import * as path from "path";
import { ActionStatusEnum, IRunnerLogManagerInterface } from "@shared/lib/runnerLog/interface";
import { IStorageManager } from "@shared/lib/storage/interface";
import { IGlobalManager } from "@shared/lib/globals/interface";
import { PlaywrightBrowserMap } from "@shared/types/browser";
import * as fs from "fs";
import { IActionResultItem } from "@shared/types/common/general";

const TEST_ACTIONS_RESULT_KEY = "TEST_RESULT";
export class CodeRunnerService {
	codeGenerator: CodeGenerator;
	actions: Array<iAction>;
	runnerConfig: ITestRunConfig;

	logManager: IRunnerLogManagerInterface;
	storageManager: IStorageManager;
	globalManager: IGlobalManager;

	constructor(
		actions: Array<iAction>,
		runnerConfig: ITestRunConfig,
		storageManager: IStorageManager,
		logManager: IRunnerLogManagerInterface,
		globalManager: IGlobalManager,
		identifer: string,
	) {
		this.codeGenerator = new CodeGenerator({
			shouldRecordVideo: runnerConfig.shouldRecordVideo,
			usePlaywrightChromium: isOpenSource(),
			browser: PlaywrightBrowserMap[runnerConfig.browser] as any,
			assetsDir: path.join("/tmp/crusher", identifer),
		});
		this.actions = actions;
		this.runnerConfig = runnerConfig;

		this.storageManager = storageManager;
		this.logManager = logManager;
		this.globalManager = globalManager;
	}

	getCompleteActionsResult(runnerActionResults: Array<IActionResultItem>): Array<IActionResultItem> {
		return this.actions.map((action, index) => {
			if (index >= runnerActionResults.length) {
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

	async runTest(): Promise<{ recordedRawVideo: string; hasPassed: boolean; error: Error | undefined; actionResults: any }> {
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
				process.env.GLOBAL_NODE_MODULES_PATH,
			);
		} catch (err) {
			console.error(err);
			error = err;
		}

		const codeGeneratorConfig = this.codeGenerator.getConfig();

		if (codeGeneratorConfig.shouldRecordVideo) {
			const recordedVideoRawPath = path.join(codeGeneratorConfig.assetsDir, "video.mp4.raw");
			if (fs.existsSync(recordedVideoRawPath)) {
				recordedRawVideoUrl = await this.storageManager.upload(recordedVideoRawPath, path.join(codeGeneratorConfig.assetsDir, "video.mp4.raw"));
			}
		}

		const testActionResults = this.globalManager.get(TEST_ACTIONS_RESULT_KEY);

		return { recordedRawVideo: recordedRawVideoUrl, hasPassed: !error, error: error, actionResults: this.getCompleteActionsResult(testActionResults) };
	}
}

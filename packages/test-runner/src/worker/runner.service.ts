import { CodeGenerator } from "@generator/src/generator";
import { isOpenSource } from "@util/helper";
import { iAction } from "@shared/types/action";
import { ITestRunConfig } from "@shared/types/runner/jobRunRequest";
import * as path from "path";
import { IRunnerLogManagerInterface } from "@shared/lib/runnerLog/interface";
import { IStorageManager } from "@shared/lib/storage/interface";
import { GlobalManager } from "@crusher-shared/lib/globals";

const TEST_ACTIONS_RESULT_KEY = "TEST_RESULT";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export class CodeRunnerService {
	codeGenerator: CodeGenerator;
	actions: Array<iAction>;
	runnerConfig: ITestRunConfig;

	logManager: IRunnerLogManagerInterface;
	storageManager: IStorageManager;
	globalManager: GlobalManager;

	constructor(
		actions: Array<iAction>,
		runnerConfig: ITestRunConfig,
		storageManager: IStorageManager,
		logManager: IRunnerLogManagerInterface,
		identifer: string,
	) {
		this.codeGenerator = new CodeGenerator({
			shouldRecordVideo: runnerConfig.shouldRecordVideo,
			usePlaywrightChromium: isOpenSource(),
			browser: runnerConfig.browser,
			assetsDir: path.join("/tmp/crusher", identifer),
		});
		this.actions = actions;
		this.runnerConfig = runnerConfig;

		this.storageManager = storageManager;
		this.logManager = logManager;
	}

	async runTest(): Promise<{ recordedRawVideo: string; hasPassed: boolean; error: Error | undefined; actionResults: any }> {
		const code = await this.codeGenerator.getCode(this.actions);
		let error, recordedRawVideoUrl;

		try {
			await new AsyncFunction("exports", "require", "module", "__filename", "__dirname", "logManager", "storageManager", code)(
				exports,
				typeof __webpack_require__ === "function" ? __non_webpack_require__ : require,
				module,
				__filename,
				__dirname,
				this.logManager,
				this.storageManager,
				process.env.GLOBAL_NODE_MODULES_PATH,
			);
		} catch (err) {
			error = err;
		}

		const codeGeneratorConfig = this.codeGenerator.getConfig();

		if (codeGeneratorConfig.shouldRecordVideo) {
			const recordedVideoRawPath = path.join(codeGeneratorConfig.assetsDir, "video.mp4");
			recordedRawVideoUrl = await this.storageManager.upload(recordedVideoRawPath, path.join(codeGeneratorConfig.assetsDir, "video.mp4"));
		}

		const testActionResults = this.globalManager.get(TEST_ACTIONS_RESULT_KEY);

		return { recordedRawVideo: recordedRawVideoUrl, hasPassed: !error, error: error, actionResults: testActionResults };
	}
}

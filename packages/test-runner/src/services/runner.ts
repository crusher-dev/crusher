import { iJobRunRequest } from "@shared/types/runner/jobRunRequest";
import { CodeGenerator } from "@generator/src/generator";
import { PLATFORM } from "@shared/types/platform";
import { getAllCapturedVideos, getBaseUrlFromEvents, getEdition, replaceBaseUrlInEvents, replaceImportWithRequire } from "@util/helper";
import { EDITION_TYPE } from "@shared/types/common/general";
import { iAction } from "@shared/types/action";
import { ITestRunConfig } from "@shared/types/runner/jobRunRequest";
import * as path from "path";
import { IRunnerLogManagerInterface } from "@shared/lib/runnerLog/interface";
import { IStorageManager } from "@shared/lib/storage/interface";
import { timeStamp } from "console";
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
		buildId: number,
		testId: number,
		storageManager: IStorageManager,
		logManager: IRunnerLogManagerInterface,
	) {
		this.codeGenerator = new CodeGenerator({
			shouldRecordVideo: runnerConfig.shouldRecordVideo,
			usePlaywrightChromium: getEdition() === EDITION_TYPE.OPEN_SOURCE,
			browser: runnerConfig.browser,
			assetsDir: `/tmp/crusher/$${buildId}/${testId}`,
		});
		this.actions = actions;
		this.runnerConfig = runnerConfig;

		this.storageManager = storageManager;
		this.logManager = logManager;
	}

	async runTest() {
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

		return { recordedRawVideo: recordedRawVideoUrl, error: error };
	}
}

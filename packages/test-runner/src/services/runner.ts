import { iJobRunRequest } from "../../../crusher-shared/types/runner/jobRunRequest";
import { CodeGenerator } from "../../../code-generator/src/generator";
import { PLATFORM } from "../../../crusher-shared/types/platform";
import { getAllCapturedVideos, getBaseUrlFromEvents, replaceBaseUrlInEvents, replaceImportWithRequire } from "../util/helper";

const BROWSER_NAME = {
	[PLATFORM.CHROME]: "chromium",
	[PLATFORM.FIREFOX]: "firefox",
	[PLATFORM.SAFARI]: "webkit",
};

export class CodeRunnerService {
	static getCode(jobRequest: iJobRunRequest) {
		const generator = new CodeGenerator({
			shouldRecordVideo: jobRequest.platform === PLATFORM.CHROME,
			isHeadless: false,
			isLiveLogsOn: true,
			browser: BROWSER_NAME[jobRequest.platform],
			assetsDir: `/tmp/crusher/${jobRequest.requestType}/${jobRequest.test.id}/${jobRequest.instanceId}`,
		});

		let events = jobRequest.test.events;
		if (jobRequest.job && jobRequest.job.host) {
			const baseURL = getBaseUrlFromEvents(events);
			const finalURL = new URL(jobRequest.job.host);
			events = replaceBaseUrlInEvents(baseURL, finalURL, events);
		}
		return replaceImportWithRequire(generator.parse(events));
	}

	static async runTest(jobRequest: iJobRunRequest, logStepsHandler: Function, handleScreenshotImagesBuffer: Function) {
		const code = this.getCode(jobRequest);
		let error = null;

		try {
			await new Function(
				"exports",
				"require",
				"module",
				"__filename",
				"__dirname",
				"logStep",
				"handleImageBuffer",
				`return new Promise(async function (resolve, reject) {
				    try{
				        ${code};
				        resolve(true);
				    } catch(err){
				      reject(err);
				    }
				});`,
			)(exports, require, module, __filename, __dirname, logStepsHandler, handleScreenshotImagesBuffer);
		} catch (err) {
			error = err;
		}

		const videos = getAllCapturedVideos(jobRequest);

		const videoKeys = Object.keys(videos);
		const video = videoKeys.length ? videos[videoKeys[0]] : null;

		return { error: error, output: { video: video } };
	}
}

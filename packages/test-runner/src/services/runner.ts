import { iJobRunRequest } from '../../../crusher-shared/types/runner/jobRunRequest';
import { CodeGenerator } from '../../../code-generator/src/generator';
import { PLATFORM } from '../../../crusher-shared/types/platform';
import { getAllCapturedImages, getAllCapturedVideos, replaceImportWithRequire } from '../util/helper';

const BROWSER_NAME = {
	[PLATFORM.CHROME]: 'chromium',
	[PLATFORM.FIREFOX]: 'firefox',
	[PLATFORM.SAFARI]: 'webkit',
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

		return replaceImportWithRequire(generator.parse(jobRequest.test.events));
	}

	static async runTest(jobRequest: iJobRunRequest, logStepsHandler: Function) {
		const code = this.getCode(jobRequest);
		let error = null;

		try {
			await new Function(
				'exports',
				'require',
				'module',
				'__filename',
				'__dirname',
				'logStep',
				`return new Promise(async function (resolve, reject) {
				    try{
				        ${code};
				        resolve(true);
				    } catch(err){
				      reject(err);
				    }
				});`,
			)(exports, require, module, __filename, __dirname, logStepsHandler);
		} catch (err) {
			error = err;
		}

		const images = getAllCapturedImages(jobRequest);
		const videos = getAllCapturedVideos(jobRequest);

		const videoKeys = Object.keys(videos);
		const video = videoKeys.length ? videos[videoKeys[0]] : null;

		return { error: error, output: { images: images, video: video } };
	}
}

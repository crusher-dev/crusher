import { replaceImportWithRequire, replaceWithPlaywrightWrapper } from '../../util/script';
import { uploadAllScreenshotsToTestBucket, uploadRecordedVideoToBucketIfAny } from '../../util/cloudBucket';
import * as shell from 'shelljs';

const { clearLogs, getLogs } = require('../../util/logs');
import * as playright from 'playwright';
import { JobPlatform } from '../interfaces/JobPlatform';
import { TestsLogs } from '../models/testLogs';
import { TEST_LOGS_SERVICE_TAGS } from './mongo/testLogs';
import { TestLiveStepsLogs } from '../models/testLiveStepsLogs';
import { TestTypes } from '../interfaces/TestTypes';
// For logging playwright methods
require('../wrapper/playwright.ts');
export default class CodeRunnerService {
	async logStep(testType, testId, type, body, meta, timeTakeForThisStep) {
		console.log('Saving logs', { testType, testId, type, body, meta });

		return new TestLiveStepsLogs({
			actionType: type,
			body: body,
			testId: testId,
			testType: testType,
			meta: {
				...(meta ? meta : {}),
				timeTaken: timeTakeForThisStep,
			},
		}).save();
	}

	async runTestAndUploadOutputs(testType: string, testId: number, code: string, instanceId: number, destination: string, platform: any = null) {
		const finalCode = replaceWithPlaywrightWrapper(replaceImportWithRequire(code.replace(/\n/gm, '')));
		let error = null;

		try {
			const codeExecute = await new Function(
				'exports',
				'require',
				'module',
				'__filename',
				'__dirname',
				'platform',
				'logStep',
				`return new Promise(async function (resolve, reject) {
				    try{
				        ${finalCode};
				        resolve(true);
				    } catch(err){
				      reject(err);
				    }
				});`,
			)(exports, require, module, __filename, __dirname, platform, this.logStep.bind(this, testType, testId));
		} catch (err) {
			error = err;
		}

			console.debug("Looking for captured screenshots");
			const images = await uploadAllScreenshotsToTestBucket(destination, instanceId, platform as JobPlatform);
			console.debug("Uploaded screenshots to bucket");
			console.debug("Looking for video now");
			const video = await uploadRecordedVideoToBucketIfAny(destination, instanceId, platform as JobPlatform);
			console.debug("Uploaded video to bucket");

			if(error){
				throw({ images, logs: getLogs(), video: video, error});
			}
			return { images, logs: getLogs(), video: video };

	}

	async initDirectories(instanceId, platform) {
		clearLogs();
		await shell.mkdir('-p', `/tmp/images/${instanceId}/${platform ? platform : JobPlatform.CHROME}`);
		await shell.mkdir('-p', `/tmp/video/${instanceId}/${platform ? platform : JobPlatform.CHROME}`);
	}

	async deleteDirectory(instanceId, platform) {
		await shell.rm('-rf', `/tmp/images/${instanceId}/${platform ? platform : JobPlatform.CHROME}`);
	}
}

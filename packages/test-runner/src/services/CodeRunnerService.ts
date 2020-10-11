import { replaceImportWithRequire, replaceWithPlaywrightWrapper } from '../../util/script';
import {uploadAllScreenshotsToTestBucket, uploadRecordedVideoToBucketIfAny} from '../../util/cloudBucket';
import * as shell from "shelljs";
const { clearLogs, getLogs } =  require( '../../util/logs');
// @ts-ignore
import * as playright from "playwright";
import {JobPlatform} from "../interfaces/JobPlatform";
// For logging playwright methods
require("../wrapper/playwright.ts");
export default class CodeRunnerService{

	async runTestAndUploadOutputs(code: string, instanceId: number, destination: string, platform: any = null){
		const finalCode = replaceWithPlaywrightWrapper(replaceImportWithRequire(code.replace(/\n/gm, '')));
		try {
			await (new Function(
				'exports',
				'require',
				'module',
				'__filename',
				'__dirname',
				'platform',
				`return new Promise(async function (resolve, reject) {
				    try{
				        ${finalCode};
				        resolve(true);
				    } catch(err){
				      reject(err);
				    }
				});`,
			)(exports, require, module, __filename, __dirname, platform));

			const images = await uploadAllScreenshotsToTestBucket(destination, instanceId, platform as JobPlatform);
			const video = await uploadRecordedVideoToBucketIfAny(destination, instanceId, platform as JobPlatform);
			return {images, logs: getLogs(), video: video}
		} catch(err){
			const images = await uploadAllScreenshotsToTestBucket(destination, instanceId, platform as JobPlatform);
			let video = await uploadRecordedVideoToBucketIfAny(destination, instanceId, platform as JobPlatform);
			throw {images, logs: getLogs(), video: video, error: err};
		}
	}

	async initDirectories(instanceId: number, platform: string){
		clearLogs();
		await shell.mkdir('-p', `/tmp/images/${instanceId}/${platform ? platform : JobPlatform.CHROME }`);
		await shell.mkdir('-p', `/tmp/video/${instanceId}/${platform ? platform : JobPlatform.CHROME }`);
	}

	async deleteDirectory(instanceId: number, platform: string){
		await shell.rm('-rf', `/tmp/images/${instanceId}/${platform ? platform : JobPlatform.CHROME}`);
	}
}

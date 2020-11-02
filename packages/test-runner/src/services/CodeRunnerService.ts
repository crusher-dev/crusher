import {replaceImportWithRequire, replaceWithPlaywrightWrapper} from '../../util/script';
import {uploadAllScreenshotsToTestBucket, uploadRecordedVideoToBucketIfAny} from '../../util/cloudBucket';
import * as shell from "shelljs";

const {clearLogs, getLogs} = require('../../util/logs');
import * as playright from "playwright";
import {JobPlatform} from "../interfaces/JobPlatform";
import {TestsLogs} from "../models/testLogs";
import {TEST_LOGS_SERVICE_TAGS} from "./mongo/testLogs";
import {TestLiveStepsLogs} from '../models/testLiveStepsLogs';
import {TestTypes} from "../interfaces/TestTypes";
// For logging playwright methods
require("../wrapper/playwright.ts");
export default class CodeRunnerService {

    async logStep(testType, testId, type, body, meta) {
        console.log("Saving logs", {testType, testId, type, body, meta});

        return (new TestLiveStepsLogs({
            actionType: type,
            body: body,
            testId: testId,
            testType: testType,
            meta: meta,
        })).save();
    }

    async runTestAndUploadOutputs(testType: string, testId: number, code: string, instanceId: number, destination: string, platform: any = null) {
        const finalCode = replaceWithPlaywrightWrapper(replaceImportWithRequire(code.replace(/\n/gm, '')));
        try {
            const codeExecute = await (new Function(
                'exports',
                'require',
                'module',
                '__filename',
                '__dirname',
                'platform',
                '_logStepToMongo',
                `return new Promise(async function (resolve, reject) {
				    try{
				        ${finalCode};
				        resolve(true);
				    } catch(err){
				      reject(err);
				    }
				});`,
            )(exports, require, module, __filename, __dirname, platform, this.logStep.bind(this, testType, testId)));

			const images = await uploadAllScreenshotsToTestBucket(destination, instanceId, platform as JobPlatform);
			const video = await uploadRecordedVideoToBucketIfAny(destination, instanceId, platform as JobPlatform);
			return {images, logs: getLogs(), video: video}
		} catch(err){
			const images = await uploadAllScreenshotsToTestBucket(destination, instanceId, platform as JobPlatform);
			let video = await uploadRecordedVideoToBucketIfAny(destination, instanceId, platform as JobPlatform);
			throw {images, logs: getLogs(), video: video, error: err};
		}
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

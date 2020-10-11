import {REDDIS} from "../../../crusher-shared/config/database";

require('../../util/logs');

import {
    GITHUB_CHECK_STATUS
} from '../constants';

import CodeRunnerService from "./CodeRunnerService";
import {RunRequest} from "../interfaces/RunRequest";
import {setTestData} from "../wrapper/playwright";
import {TestTypes} from "../interfaces/TestTypes";
import {JobPlatform} from "../interfaces/JobPlatform";
import {TestLogsService} from "./mongo/testLogs";
import {Job, Queue} from "bullmq";

const MongoManager = require('../manager/MongoManager').default;

new MongoManager().init();
const codeRunnerService = new CodeRunnerService();

const videoProcessingQueue = new Queue('video-processing-queue', {connection: REDDIS});

module.exports = async (bullJob: Job) => {
    const {job, test, instanceId} = bullJob.data as RunRequest;
    //@ts-ignore
    const {id, prId, branchName, repoName, commitId, projectId, trigger, status, host, githubInstallationId, platform, githubCheckRunId} = job ? job : {} as any;

    setTestData(instanceId, job, test, platform ? platform : JobPlatform.CHROME);

    await codeRunnerService.initDirectories(instanceId, platform ? platform : JobPlatform.CHROME);
    const testLogsService = new TestLogsService();
    testLogsService.init(test.id, instanceId, test.testType, job ? job.id : -1);

    await testLogsService.notifyTestRunning();
    if (bullJob.progress)
        {
            // @ts-ignore
            await bullJob.progress({
                        jobId: id,
                        githubCheckRunId,
                        githubInstallationId,
                        repoName,
                        status: GITHUB_CHECK_STATUS.IN_PROGRESS,
                        testInstanceId: instanceId,
                        testType: test.testType ? test.testType : TestTypes.SAVED
                    });
        }

    try {
        const {images, logs, video} = await codeRunnerService.runTestAndUploadOutputs(test.code, instanceId, `${test.testType ? test.testType : TestTypes.SAVED}/${test.id}/${instanceId}`, platform ? platform : JobPlatform.CHROME);
        console.log('Test executed perfectly.');
        await testLogsService.notifyTestExecutionPassed();
        await codeRunnerService.deleteDirectory(instanceId, platform ? platform : JobPlatform.CHROME);

        const returnInfo = {
            status: 200,
            message: 'Test successful',
            logs,
            images,
            testId: test.id,
            test: test.testType,
            jobId: job && job.id,
            instanceId: instanceId,
            githubInstallationId,
            githubCheckRunId,
            testType: test.testType,
            isError: false,
            testCount: job && job.testCount ? job.testCount : 1,
            video: null,
            fullRepoName: repoName
        };

        if (video) {
            await videoProcessingQueue.add(
                instanceId.toString(),
                {...returnInfo, video: video},
                {lifo: false, removeOnComplete: true, attempts: 1},
            );
        }

        return returnInfo;
    } catch (res) {
        const {error: err} = res;
        console.error('Test Failed!! Reason: ' + err.toString());
        let returnInfo;
        try {
            await testLogsService.notifyTestExecutionFailed({err: err});
        } catch (ex) {
            console.error("Failed to notify test execution");
        }
        let {logs, images, video} = res;

        try {
            await codeRunnerService.deleteDirectory(instanceId, platform ? platform : JobPlatform.CHROME);
        } catch (ex) {
            console.error("Failed to notify clean up directories");
        }
        returnInfo = {
            isError: true,
            message: JSON.stringify(err),
            logs,
            testId: test.id,
            jobId: id,
            instanceId: instanceId,
            githubInstallationId,
            githubCheckRunId,
            testCount: job && job.testCount,
            fullRepoName: repoName,
            testType: test.testType,
            video: null,
            images
        };
        try {
            if (video) {
                await videoProcessingQueue.add(
                    instanceId.toString(),
                    {...returnInfo, video: video},
                    {lifo: false, removeOnComplete: true, attempts: 1},
                );
            }
        } catch (ex) {
        }

        return returnInfo;
    }
};

require('../../util/logger');

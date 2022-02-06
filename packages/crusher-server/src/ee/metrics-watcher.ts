import { RedisManager } from "@modules/redis";
import { Queue } from "bullmq";
import * as AWS from "aws-sdk";

const ECS_CLUSTER = "crusher-test-runner";
const ECS_SERVICE = "crusher-test-service";
const ECS_REGION = "us-east-1";

console.log("Starting up...");

const redisManager = new RedisManager();
const redisClient = redisManager.redisClient;

const testExecutionQueue = new Queue("TEST_EXECUTION_QUEUE", {
	connection: redisClient,
});
const testResultProcessorQueue = new Queue("TEST_COMPLETE_QUEUE", {
	connection: redisClient,
});
const videoProcessorQueue = new Queue("VIDEO_PROCESSOR_QUEUE", {
	connection: redisClient,
});

const cloudwatch = new AWS.CloudWatch({ region: ECS_REGION });
const ecs = new AWS.ECS({ region: ECS_REGION });

function getCurrentDesiredCount(ecsService, ecsCluster) {
	return new Promise((resolve, reject) => {
		ecs.describeServices({ services: [ecsService], cluster: ecsCluster }, (err, data) => {
			if (err) return reject(err);

			return resolve(data.services[0].desiredCount);
		});
	});
}

async function sendCustomMetric(
	testExecutionData,
	testResultProcessorData,
	videoProcessorData,
	testExecutionDesiredCount,
	testCompleteWorkerCount,
	videoProcessWorkerCount,
) {
	const dateNow = new Date();

	const testExecutionWorkerNeeded = Math.max((testExecutionData.active + testExecutionData.waiting) / 3 - testExecutionDesiredCount, 0);
	const testCompleteWorkerNeeded = Math.max((testResultProcessorData.active + testResultProcessorData.waiting) / 10 - testCompleteWorkerCount, 0);
	const videoProcessorWorkerNeeded = Math.max((videoProcessorData.active + videoProcessorData.waiting) / 7 - videoProcessWorkerCount, 0);

	// console.log("Text execution worker needed", testExecutionWorkerNeeded);
	// console.log("Test complete worker needed", testCompleteWorkerNeeded);
	// console.log("Video processor worker needed", videoProcessorWorkerNeeded);
	const metric = {
		MetricData: [
			/* required */
			{
				MetricName: "TEST_EXECUTION_QUEUE" /* required */,
				Dimensions: [],
				Timestamp: dateNow,
				Unit: "Count",
				Value: testExecutionWorkerNeeded,
			},
			{
				MetricName: "TEST_COMPLETE_QUEUE" /* required */,
				Dimensions: [],
				Timestamp: dateNow,
				Unit: "Count",
				Value: testCompleteWorkerNeeded,
			},
			{
				MetricName: "VIDEO_PROCESSOR_QUEUE" /* required */,
				Dimensions: [],
				Timestamp: dateNow,
				Unit: "Count",
				Value: videoProcessorWorkerNeeded,
			},
		],
		Namespace: "crusher_inra_1" /* required */,
	};
	cloudwatch.putMetricData(metric, (err, data) => {
		if (err) {
			console.log("Error sending metric data: ", err);
		} else {
			console.log("Metric data sent successfully", data);
		}
	});
}

const setupMetricsWatcher = async () => {
	testExecutionQueue.waitUntilReady();
	testResultProcessorQueue.waitUntilReady();
	videoProcessorQueue.waitUntilReady();
	console.log("Connected to execution queue...");

	async function callback() {
		const testExecutionWaitingJobs = await testExecutionQueue.getWaitingCount();
		const testExecutionActiveJobs = await testExecutionQueue.getActiveCount();

		const videoProcessorWaitingJobs = await videoProcessorQueue.getWaitingCount();
		const videoProcessorActiveJobs = await videoProcessorQueue.getActiveCount();

		const testResultProcessorWaitingJobs = await testResultProcessorQueue.getWaitingCount();
		const testResultProcessorActiveJobs = await testResultProcessorQueue.getActiveCount();

		const testExecutionDesiredCount = await getCurrentDesiredCount(ECS_SERVICE, ECS_CLUSTER);
		const testResultProcessorDesiredCount = await getCurrentDesiredCount("crusher-test-result-processor", ECS_CLUSTER);
		const videoProcessorDesiredCount = await getCurrentDesiredCount("crusher-testing", "crusher-video-processor");

		// Console log the metrics
		// console.log(`
		//         Test Execution Queue:
		//         Waiting Jobs: ${testExecutionWaitingJobs}
		//         Active Jobs: ${testExecutionActiveJobs}
		//     `);

		// console.log(`
		//         Video Processor Queue:
		//         Waiting Jobs: ${videoProcessorWaitingJobs}
		//         Active Jobs: ${videoProcessorActiveJobs}
		//     `);

		// console.log(`
		//         Test Result Processor Queue:
		//         Waiting Jobs: ${testResultProcessorWaitingJobs}
		//         Active Jobs: ${testResultProcessorActiveJobs}
		//     `);

		// console.log(`
		//         Current Desired Count: ${currentDesiredCount}
		//     `);

		// console.log(`
		//         Test Result Processor Desired Count: ${testResultProcessorDesiredCount}
		//     `);

		// console.log(`
		//         Video Processor Desired Count: ${videoProcessorDesiredCount}
		//     `);
		await sendCustomMetric(
			{ waiting: testExecutionWaitingJobs, active: testExecutionActiveJobs },
			{ waiting: testResultProcessorWaitingJobs, active: testResultProcessorActiveJobs },
			{ waiting: videoProcessorWaitingJobs, active: videoProcessorActiveJobs },
			testExecutionDesiredCount,
			testResultProcessorDesiredCount,
			videoProcessorDesiredCount,
		);
	}

	await callback();
	const interval = setInterval(async () => {
		await callback();
	}, 10000);
};

export { setupMetricsWatcher };

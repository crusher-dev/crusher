import "reflect-metadata";
import { Job } from "bullmq";
import Container from "typedi";
import { ITestCompleteQueuePayload } from "@crusher-shared/types/queues/";
import { TestRunnerQueue } from "../queue.service";

const runnerQueueService = Container.get(TestRunnerQueue);

interface ITestResultWorkerJob extends Job {
	data: ITestCompleteQueuePayload;
}

function setupGracefulShutdown() {
	process.on("SIGTERM", async () => {
		console.error("Got SIGTERM in worker");
		setTimeout(() => {
			console.warn(`Couldn't pause all queues within 30s, sorry! Exiting.`);
		}, 30000);
	});
	process.on("unhandledRejection", (reason, p) => {
		p.catch((error) => {
			console.error("unhandledRejection" + `Caught exception: ${reason}\n` + `Exception origin: ${p}`);
			console.error(error);
		});
	});

	process.on("uncaughtException", (err: Error) => {
		console.error("uncaughtException" + `Caught exception: ${err.message}\n` + `Exception origin: ${err.stack}`);
		console.error(err);
	});
}

setupGracefulShutdown();
const processTestAfterExecution = async function (bullJob: ITestResultWorkerJob): Promise<any> {
	return runnerQueueService.handleWorkerJob(bullJob);
};

export default processTestAfterExecution;

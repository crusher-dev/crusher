require("dotenv").config();

import "reflect-metadata";
import { CronJob } from "cron";
import { Container } from "typedi";
import MonitoringService from "./core/services/MonitoringService";
import { Logger } from "./utils/logger";
import JobRunnerService from "./core/services/v2/JobRunnerService";
import ProjectHostsService from "./core/services/ProjectHostsService";
import { JOB_TRIGGER } from "../../crusher-shared/types/jobTrigger";
import MongoManager from "./core/manager/MongoManager";
import JobsService from "./core/services/JobsService";
import DBManager from "./core/manager/DBManager";
import { RedisManager } from "@manager/redis";
import { REDIS } from "crusher-server/config/database";

RedisManager.initialize(REDIS.host, REDIS.port, REDIS.password);

const monitoringService = Container.get(MonitoringService);
const projectHostsService = Container.get(ProjectHostsService);
const jobRunnerService = Container.get(JobRunnerService);

async function preChecks() {
	const dbManager: DBManager = Container.get(DBManager);
	const mongodbService: MongoManager = Container.get(MongoManager);

	const isDbAlive = await dbManager.isAlive();
	console.log(isDbAlive, mongodbService.isAlive());
	return isDbAlive && mongodbService.isAlive();
}

export async function init() {
	if (!(await preChecks())) {
		throw new Error("Some error occurred while trying to connection with mongodb or mysql");
		process.exit();
	}

	Logger.debug("CRON", "Started STOP_STALLED_TESTS_CHECKER cron job every 10 minutes");
	const stopStalledTestsCronJob = new CronJob(
		"*/10 * * * * *",
		async function () {
			console.log("[Stalled]: Stopping stalled jobs");
			try {
				const jobsService = Container.get(JobsService);
				await jobsService.stopAllJobsRunningForMoreThanAnHour();
			} catch (ex) {
				this.stop();
				// Restart the process to avoid cron loop in-case of unhandled errors like service connection failure.
				process.exit();
			}
		},
		null,
		true,
		"America/Los_Angeles",
	);
	stopStalledTestsCronJob.start();

	Logger.debug("CRON", "Started RUN_MONITORING_TESTS cron job every 10 seconds");
	const startTestQueue = new CronJob(
		"*/10 * * * * *",
		async function () {
			const queuedMonitorings = await monitoringService.getQueuedMonitorings();

			try {
				for (const monitoring of queuedMonitorings) {
					const host = await projectHostsService.getHost(monitoring.target_host);
					await jobRunnerService.runTestsInProject(monitoring.project_id, monitoring.platform, JOB_TRIGGER.CRON, monitoring.user_id, host, null);
					await monitoringService.updateLastCronRunForProject(monitoring.id);
				}
			} catch (ex) {
				// Cleanup job if some error occurred during cron
				Logger.fatal("startTestCron", "Error occurred when starting the tests", ex);

				this.stop();
				// Restart the process to avoid cron loop in-case of unhandled errors like service connection failure.
				process.exit();
			}
		},
		null,
		true,
		"America/Los_Angeles",
	);
	startTestQueue.start();
}

init();

require("dotenv").config();

import "reflect-metadata";
import { CronJob } from "cron";
import { Container } from "typedi";
import { ProjectMonitoringService } from "@modules/resources/projects/monitoring/service";
import { TestService } from "@modules/resources/tests/service";
import { BuildTriggerEnum } from "@modules/resources/builds/interface";
import { MongoManager } from "@modules/db/mongo";

const projectMonitoringService = Container.get(ProjectMonitoringService);
const testService = Container.get(TestService);
const mongoManager = Container.get(MongoManager);

export async function init() {
	mongoManager.waitUntilAlive();

	const cronBuildJobs = new CronJob(
		"*/1 * * * *",
		async function () {
			const queuedMonitorings = await projectMonitoringService.getQueuedMonitoringDetails();
			try {
				for (const monitoring of queuedMonitorings) {
					testService.runTestsInProject(monitoring.projectId, monitoring.userId, {
						browser: monitoring.environmentBrowser,
						buildTrigger: BuildTriggerEnum.CRON,
					});
					await projectMonitoringService.updateLastCronMarker(monitoring.id);
				}
			} catch (ex) {
				// Cleanup job if some error occurred during cron
				console.error("queuedMonitoringsCron", "Error occurred when starting the tests", ex);

				this.stop();
				// Restart the process to avoid cron loop in-case of unhandled errors like service connection failure.
				process.exit();
			}
		},
		null,
		true,
		"America/Los_Angeles",
	);

	cronBuildJobs.start();
}

init();

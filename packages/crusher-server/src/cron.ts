require("dotenv").config();
import { BuildTriggerEnum } from "@modules/resources/builds/interface";
import { ProjectEnvironmentService } from "@modules/resources/projects/environments/service";
import { ProjectMonitoringService } from "@modules/resources/projects/monitoring/service";
import { TestService } from "@modules/resources/tests/service";
import { UsersService } from "@modules/resources/users/service";
import { CronJob } from "cron";
import "reflect-metadata";
import { Container } from "typedi";
import { setupMetricsWatcher } from "./ee/metrics-watcher";

const projectMonitoringService = Container.get(ProjectMonitoringService);
const testService = Container.get(TestService);
const projectEnvironmentsService = Container.get(ProjectEnvironmentService);

const usersService = Container.get(UsersService);

async function setupCronForBuilds() {
	const cronBuildJobs = new CronJob(
		"*/1 * * * *",
		async function () {
			const queuedMonitorings = await projectMonitoringService.getQueuedMonitoringDetails();
			try {
				for (const monitoring of queuedMonitorings) {
					if (!monitoring.environmentId) return;
					const environment = await projectEnvironmentsService.getEnvironment(monitoring.environmentId);
					let vars = {};
					if (environment.vars) {
						try {
							vars = JSON.parse(environment.vars);
						} catch (e) {}
					}
					testService.runTestsInProject(monitoring.projectId, environment.userId, {
						browser: environment.browser,
						buildTrigger: BuildTriggerEnum.CRON,
						host: environment.host ? environment.host : "null",
						context: vars,
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

	return cronBuildJobs;
}

// EE (PROD)
async function stupCronForTestingAccountsCleanup() {
	const cron = new CronJob(
		"*/10 * * * *",
		async function () {
			try {
				await Promise.all(await usersService.deleteAllTestUsers());
			} catch (ex) {
				console.error("Error occurred while cleaning up the test users", ex);
			}
		},
		null,
		true,
		"America/Los_Angeles",
	);

	cron.start();

	return cron;
}

export async function init() {
	// await setupCronForBuilds();
	// await stupCronForTestingAccountsCleanup();
	await setupMetricsWatcher();
}

init();

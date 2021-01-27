import { CronJob } from "cron";
import { Container } from "typedi";
import JobsService from "../../core/services/JobsService";
import MonitoringService from "../../core/services/MonitoringService";
import { Logger } from "../../utils/logger";
import JobRunnerService from "../../core/services/v2/JobRunnerService";
import ProjectHostsService from "../../core/services/ProjectHostsService";
import { JOB_TRIGGER } from "../../../../crusher-shared/types/jobTrigger";

const monitoringService = Container.get(MonitoringService);
const projectHostsService = Container.get(ProjectHostsService);
const jobRunnerService = Container.get(JobRunnerService);

export function init() {
	Logger.debug("CRON", "Started STOP_STALLED_TESTS_CHECKER cron job every 10 minutes");
	const stopStalledTestsCronJob = new CronJob(
		"* */10 * * * *",
		async function () {
			const jobsService = Container.get(JobsService);
			await jobsService.stopAllJobsRunningForMoreThanAnHour();
		},
		null,
		true,
		"America/Los_Angeles",
	);

	Logger.debug("CRON", "Started RUN_MONITORING_TESTS cron job every 10 seconds");
	const startTestQueue = new CronJob(
		"*/10 * * * * *",
		async function () {
			const queuedMonitorings = await monitoringService.getQueuedMonitorings();

			try {
				for (let monitoring of queuedMonitorings) {
					const host = await projectHostsService.getHost(monitoring.target_host);
					await jobRunnerService.runTestsInProject(monitoring.project_id, monitoring.platform, JOB_TRIGGER.CRON, monitoring.user_id, host, null);
					await monitoringService.updateLastCronRunForProject(monitoring.project_id);
				}
			} catch (ex) {
				// Cleanup job if some error occurred during cron
				Logger.fatal("startTestCron", "Error occurred when starting the tests", ex);
			}
		},
		null,
		true,
		"America/Los_Angeles",
	);
}

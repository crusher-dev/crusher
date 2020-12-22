import { CronJob } from "cron";
import { Container } from "typedi";
import JobsService, { TRIGGER } from "../../core/services/JobsService";
import MonitoringService from "../../core/services/MonitoringService";
import { Platform } from "../../core/interfaces/Platform";
import { JobTrigger } from "../../core/interfaces/JobTrigger";
import { addJobToRequestQueue } from "../../core/utils/queue";
import TestService from "../../core/services/TestService";
import ProjectHostsService from "../../core/services/ProjectHostsService";
import { Logger } from "../../utils/logger";
import { TestType } from "../../core/interfaces/TestType";

export function init() {
	console.log("Starting cron jobs");
	const checkRunningTestsJob = new CronJob(
		"* */10 * * * *",
		async function () {
			const jobsService = Container.get(JobsService);
			await jobsService.stopAllJobsRunningForMoreThanAnHour();
		},
		null,
		true,
		"America/Los_Angeles",
	);

	const startTestQueue = new CronJob(
		"*/10 * * * * *",
		async function () {
			// console.log('Triggered cron for starting tests');
			const monitoringService = Container.get(MonitoringService);
			const testService = Container.get(TestService);
			const jobService = Container.get(JobsService);
			const hostsService = Container.get(ProjectHostsService);
			const projectsToStart = await monitoringService.getProjectsForCronNow();

			try {
				for (let i = 0; i < projectsToStart.length; i++) {
					const projectMonitoringSettings = projectsToStart[i];
					const testsInProjectArr = await testService.getAllTestsInProject(projectMonitoringSettings.project_id);

					const testIds = testsInProjectArr.map((test) => test.id);
					const host = projectMonitoringSettings.target_host ? await hostsService.getHost(projectMonitoringSettings.target_host) : null;
					let job = await jobService.createOrUpdateJob(null, null, {
						projectId: projectMonitoringSettings.project_id,
						host: host ? host.url : null,
						branchName: null,
						commitName: null,
						testIds: testIds,
						userId: projectMonitoringSettings.user_id,
						platform: Platform.ALL, // @TODO: Remove this
						installation_id: null,
						trigger: JobTrigger.CRON,
					});

					// console.log('Adding job to queue', job);
					await addJobToRequestQueue({
						jobId: job.id,
						projectId: projectMonitoringSettings.project_id,
						tests: testsInProjectArr,
						branchName: null,
						repoName: null,
						commitId: null,
						trigger: TRIGGER.CRON,
						testType: TestType.SAVED,
						githubInstallationId: job.installation_id,
						githubCheckRunId: null,
						host: host ? host.url : null,
						platform: job.platform,
					}).catch(async (err) => {
						// @TODO: Also stop any test instances if any
						Logger.error("startTestCron", "Something went wrong while adding a job to queue. Deleting them now", {
							err,
						});
						await jobService.deleteJob(job.id);
					});
					await monitoringService.updateLastCronRunForProject(projectMonitoringSettings.project_id);
				}
			} catch (ex) {
				// Cleanup job if some error occured during cron
				Logger.fatal("startTestCron", "Error occurred when starting the tests", ex);
			}
		},
		null,
		true,
		"America/Los_Angeles",
	);
}

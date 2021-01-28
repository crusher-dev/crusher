import { Container, Service } from "typedi";
import DBManager from "../../manager/DBManager";
import { JOB_TRIGGER } from "../../../../../crusher-shared/types/jobTrigger";
import { addJobToRequestQueue } from "../../utils/queue";
import JobsService from "../JobsService";
import TestService from "../TestService";
import { iHost } from "../../../../../crusher-shared/types/db/host";
import { Logger } from "../../../utils/logger";
import { PLATFORM } from "../../../../../crusher-shared/types/platform";
import { iTest } from "../../../../../crusher-shared/types/db/test";
import { TestType } from "../../interfaces/TestType";

interface iGitInfo {
	commitId: string;
	repoName: string;
	branchName: string;
	commitName: string;
	installationId: number;
}

@Service()
export default class JobRunnerService {
	private dbManager: DBManager;
	private testService: TestService;
	private jobsService: JobsService;

	constructor() {
		this.dbManager = Container.get(DBManager);
		this.testService = Container.get(TestService);
		this.jobsService = Container.get(JobsService);
	}

	async addJobToQueue(
		projectId: number,
		userId: number,
		tests: Array<iTest>,
		platform: PLATFORM,
		trigger: JOB_TRIGGER = JOB_TRIGGER.MANUAL,
		hostUrl: string | null = null,
		gitInfo: iGitInfo | null = null,
	) {
		const testIds = tests.map((test) => test.id);

		let job = await this.jobsService.createOrUpdateJob(null, null, {
			projectId: projectId,
			host: hostUrl,
			repoName: gitInfo?.repoName,
			branchName: gitInfo?.branchName,
			commitName: gitInfo?.commitName,
			commitId: gitInfo?.commitId,
			testIds: testIds,
			userId: userId,
			platform: platform, // @TODO: Remove this
			installation_id: gitInfo?.installationId,
			trigger: trigger,
		});

		const jobRequest = {
			jobId: job.id,
			projectId: projectId,
			tests: tests,
			branchName: gitInfo?.branchName,
			repoName: gitInfo?.repoName,
			commitName: gitInfo?.commitName,
			commitId: gitInfo?.commitId,
			trigger: trigger,
			testType: TestType.SAVED,
			githubInstallationId: gitInfo?.installationId,
			githubCheckRunId: null,
			host: hostUrl,
			platform: platform,
		};

		await addJobToRequestQueue(jobRequest).catch(async (err) => {
			// @TODO: Also stop any test instances if any
			Logger.error("startTestCron", "Something went wrong while adding a job to queue. Deleting them now", {
				err,
			});
			await this.jobsService.deleteJob(job.id);
		});

		return jobRequest;
	}

	async runTestsInProject(
		projectId: number,
		platform: PLATFORM,
		jobTrigger: JOB_TRIGGER,
		userId: number | null = null,
		host: iHost | null = null,
		gitInfo: iGitInfo | null = null,
	) {
		const tests = await this.testService.getAllTestsInProject(projectId);

		const jobRequest = await this.addJobToQueue(projectId, userId, tests, platform, jobTrigger, host ? host.url : null, gitInfo);

		Logger.debug("JOB_RUNNER", `Adding ${jobRequest.jobId} to the queue`, { jobRequest });
	}
}

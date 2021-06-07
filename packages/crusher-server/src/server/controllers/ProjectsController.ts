import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Req, UnauthorizedError } from "routing-controllers";
import { Container, Inject, Service } from "typedi";
import DBManager from "../../core/manager/DBManager";
import UserService from "../../core/services/UserService";
import ProjectService from "../../core/services/ProjectService";
import JobsService, { TRIGGER } from "../../core/services/JobsService";

import TestService from "../../core/services/TestService";
import { decodeToken } from "../../core/utils/auth";
import GithubService from "../../core/services/GithubService";
import { addJobToRequestQueue } from "../../core/utils/queue";
import * as chalk from "chalk";
import { Logger } from "../../utils/logger";
import { Platform } from "../../core/interfaces/Platform";
import { JobTrigger } from "../../core/interfaces/JobTrigger";
import { TestType } from "../../core/interfaces/TestType";
import { iAllProjectsItemResponse } from "@crusher-shared/types/response/allProjectsResponse";
import { GitIntegrationsService } from "../../core/services/mongo/gitIntegrations";

const RESPONSE_STATUS = {
	PROJECT_CREATED: "PROJECT_CREATED",
	PROJECT_CREATION_FAILED: "PROJECT_CREATION_FAILED",
};

@Service()
@JsonController("/projects")
export class ProjectsController {
	@Inject()
	private userService: UserService;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private testService: TestService;
	@Inject()
	private jobService: JobsService;
	@Inject()
	private gitIntegrationsService: GitIntegrationsService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
	@Post("/create")
	async createProject(@CurrentUser({ required: true }) user, @Body() projectDetails) {
		const { projectName } = projectDetails;
		const { team_id } = user;
		return this.projectService
			.createProject(projectName, team_id)
			.then((project) => {
				if (!project) {
					throw new Error("Can't create project");
				}
				return {
					status: RESPONSE_STATUS.PROJECT_CREATED,
					projectId: project.insertId,
				};
			})
			.catch((err) => {
				return { status: RESPONSE_STATUS.PROJECT_CREATION_FAILED };
			});
	}

	@Authorized()
	@Get("/getAll")
	async getAllProjects(@CurrentUser({ required: true }) user): Promise<Array<iAllProjectsItemResponse>> {
		const { user_id } = user;

		return this.projectService.getAllProjectsOfUser(user_id);
	}

	@Get("/testsCount/:projectId")
	async getTestsCountInProject(@CurrentUser({ required: true }) user, @Param("projectId") projectId) {
		const { user_id, team_id } = user;

		const canAccessThisProject = await this.userService.canAccessProjectId(projectId, user_id);

		if (!canAccessThisProject) {
			return new UnauthorizedError("Don't have access for this project");
		}

		return {
			totalTests: await this.testService.getTestsCountInProject(projectId),
		};
	}

	@Get("/meta/dashboard/info/:projectId")
	async getMetaDashboardInfoOfProject(@Param("projectId") projectId: number) {
		const totalJobsToday = await this.projectService.getNoBuildsTodayOfProject(projectId);
		const info = await this.projectService.getHealthAndStatus(projectId);

		return {
			totalJobsToday: totalJobsToday.count,
			health: info.health,
			status: info.status,
		};
	}

	@Post("/runTests/:projectId")
	async runTestsInProject(@Param("projectId") projectId, @Req() req, @Body() body) {
		try {
			const { cliToken, host, branchName, commitId, repoName, commitName, platform, isFromGithub } = body;
			const { user_id, team_id } = decodeToken(cliToken);

			const user = await this.userService.getUserInfo(user_id);
			if (!user) {
				return new UnauthorizedError("Wrong CLI Token provided!!");
			}

			const canAccessThisProject = await this.userService.canAccessProjectId(projectId, user_id);

			if (!canAccessThisProject) {
				return new UnauthorizedError("Don't have access for this project");
			}

			const testsInProject = await this.testService.getAllTestsInProject(projectId, true);
			const testIds = testsInProject.map((test) => test.id);
			const githubInstallationRecord = await this.gitIntegrationsService.getInstallationRepo(repoName, projectId);

			const job = await this.jobService.createOrUpdateJob(repoName, commitId, {
				projectId,
				host,
				branchName,
				commitName,
				testIds: testIds,
				userId: user_id,
				platform: Platform.ALL, // @TODO: Remove this
				installation_id: githubInstallationRecord ? githubInstallationRecord.installationId : null,
				trigger: githubInstallationRecord || cliToken ? JobTrigger.CLI : JobTrigger.MANUAL,
			});

			let checkRunId = null;

			if (job.installation_id && isFromGithub) {
				const githubService = new GithubService();

				await githubService.authenticateAsApp(job.installation_id);

				const { checkRunId: _check } = (await githubService.createCheckRunFromJob(job)) as any;
				checkRunId = _check;
				Logger.debug("ProjectsController::runTestsInProject", chalk.hex("#0b2ce2").bold(`Got check run id: ${checkRunId}`));

				await this.jobService.updateJobInfo(job.id, {
					check_run_id: checkRunId,
				});
			}

			await addJobToRequestQueue({
				jobId: job.id,
				projectId,
				tests: testsInProject,
				branchName: branchName,
				repoName: repoName,
				commitId: commitId,
				trigger: TRIGGER.CLI,
				githubInstallationId: job.installation_id,
				testType: TestType.SAVED,
				githubCheckRunId: checkRunId ? checkRunId : null,
				host: host,
				platform: job.platform,
			});

			return { status: "RUNNING_TESTS", jobId: job.id };
		} catch (err) {
			Logger.error("ProjectsController::runTestsInProject", "401 Bad request", {
				err,
			});
		}
	}
}

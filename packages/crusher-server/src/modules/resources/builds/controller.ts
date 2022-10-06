import { UsersService } from "@modules/resources/users/service";
import { JsonController, Get, Param, QueryParams, Post, Authorized, CurrentUser, Body } from "routing-controllers";
import { Inject, Service } from "typedi";
import { BuildsService } from "@modules/resources/builds/service";
import { IProjectBuildListResponse } from "@crusher-shared/types/response/iProjectBuildListResponse";
import { BuildStatusEnum, BuildTriggerEnum } from "./interface";
import { BuildReportStatusEnum } from "../buildReports/interface";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { IUserTable } from "../users/interface";
import { TestsRunner } from "@modules/runner";
import { BuildsActionService } from "./build.actions.service";
import { RedisManager } from "@modules/redis";
import { v4 as uuidv4 } from "uuid";
import { TestRunnerQueue } from "@modules/runner/queue.service";
import { BrowserEnum } from "@modules/runner/interface";
import { TestService } from "../tests/service";

@Service()
@JsonController("")
export class BuildsController {
	@Inject()
	private userService: UsersService;
	@Inject()
	private buildsService: BuildsService;
	@Inject()
	private buildsActionService: BuildsActionService;
	@Inject()
	private testRunnerQueueService: TestRunnerQueue;
	@Inject()
	private redisManager: RedisManager;
	@Inject()
	private testsService: TestService;

	@Authorized()
	@Post("/projects/:project_id/builds/actions/create.local")
	async createLocalBuild(@CurrentUser({required: true}) user, @Param("project_id") projectId, @Body() body: { tests: Array<{ steps: Array<any>; id: number; name: string; status: "FINISHED" | "FAILED" }> }) {
		const { build, buildReport, buildReportStatus } = await this.testRunnerQueueService.saveLocalBuilds(body.tests, {
			userId: user.user_id,
			projectId: projectId,
			host: "",
			config: {
				shouldRecordVideo: false,
				testIds: body.tests.map((a) => a.id),
				browser: BrowserEnum.CHROME,
			},
			meta: {
				disableBaseLineComparisions: true
			},
			status: BuildStatusEnum.CREATED,
			buildTrigger: BuildTriggerEnum.MANUAL,
			browser: [BrowserEnum.CHROME],
		});

		return { build, buildReportStatus };
	}

	@Authorized()
	@Get("/projects/:project_id/builds/actions/get.local")
	async getLocalBuild(@CurrentUser({ required: true }) user, @Param("project_id") projectId, @QueryParams() queryParams: { localBuildKey: string }) {
		const localBuildKey = queryParams.localBuildKey;
		const localBuild = await this.redisManager.get(localBuildKey);
		if (!localBuild) {
			throw new Error("Build not found");
		}
		const build = JSON.parse(localBuild);
		build.projectId = projectId;
		return build;
	}

	@Get("/projects/:project_id/builds")
	public async getBuildsList(
		@Param("project_id") projectId: number,
		@QueryParams()
		params: { triggerType?: BuildTriggerEnum; triggeredBy?: number; search?: string; page?: number; status?: BuildReportStatusEnum; buildId?: number },
	): Promise<IProjectBuildListResponse & { availableAuthors: Array<Pick<KeysToCamelCase<IUserTable>, "name" | "email" | "id">> }> {
		if (!params.page) params.page = 0;

		const buildsData = await this.buildsService.getBuildInfoList(projectId, params);

		const buildsListPromise = buildsData.list.map(async (buildData) => {
			if(!buildData.buildHost || buildData.buildHost === "null") {
				const tests = await this.testsService.getTestsInBuild(buildData.buildId);
				const events = tests.map((test) => test.events);
				let finalHost = null;
				for(let event of events) {
					try {
						const events = JSON.parse(event);
						finalHost = events.find((event) => event.type === "PAGE_NAVIGATE_URL").payload.meta.value;
						break;
					} catch(ex) {}
				}
				if(finalHost) {
					buildData.buildHost = finalHost;
				}
			}
			return {
				id: buildData.buildId,
				host: buildData.buildHost && buildData.buildHost !== null ? buildData.buildHost : undefined,
				// @Note: There is no exact such thing as build name. For now build name
				// is same as commit name if it present otherwise it will be null
				name: buildData.buildName,
				trigger: buildData.buildTrigger,
				createdAt: new Date(buildData.buildCreatedAt).getTime(),
				tests: {
					totalCount: buildData.totalTestCount,
					passedCount: buildData.passedTestCount,
					failedCount: buildData.failedTestCount,
					reviewRequiredCount: buildData.reviewRequiredTestCount,
				},
				status: buildData.buildStatus,
				// In seconds
				duration: buildData.buildDuration,
				
				triggeredBy: {
					id: buildData.triggeredById,
					name: buildData.triggeredByName,
				},
				commentCount: buildData.commentCount ? buildData.commentCount : 0,
			};
		});

		const buildsList = await Promise.all(buildsListPromise);

		const availableAuthors = (await this.userService.getUsersInProject(projectId)).map((user) => {
			return { name: user.name, email: user.email, id: user.id };
		});

		return {
			list: buildsList,
			totalPages: buildsData.totalPages,
			availableAuthors: availableAuthors,
		};
	}

	@Authorized()
	@Post("/builds/:build_id/actions/rerun")
	async rerunBuild(@CurrentUser({ required: true }) user, @Param("build_id") buildId: number) {
		await this.buildsActionService.rerunBuild(buildId, user.user_id);

		return {
			status: "Successful",
		};
	}

	@Authorized()
	@Get("/builds/:build_id/status")
	async getStatus(@CurrentUser({ required: true }) user, @Param("build_id") buildId) {
		return this.buildsService.getBuild(buildId);
	}
}

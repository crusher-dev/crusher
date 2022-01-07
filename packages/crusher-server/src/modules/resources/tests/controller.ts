import { UsersService } from "@modules/resources/users/service";
import { JsonController, Get, Authorized, BadRequestError, Post, Param, CurrentUser, Body, QueryParams, Params } from "routing-controllers";
import { Inject, Service } from "typedi";
import { TestService } from "@modules/resources/tests/service";
import { getTemplateFileContent, isUsingLocalStorage } from "@utils/helper";
import { IProjectTestsListResponse } from "@crusher-shared/types/response/iProjectTestsListResponse";
import { ICreateTestPayload } from "@modules/resources/tests/interface";
import { iAction } from "@crusher-shared/types/action";
import { TestsRunner } from "@modules/runner";
import { BuildStatusEnum, BuildTriggerEnum } from "../builds/interface";
import { BrowserEnum } from "@modules/runner/interface";
import { BuildReportStatusEnum } from "../buildReports/interface";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { IUserTable } from "../users/interface";
import { BuildsService } from "../builds/service";

@Service()
@JsonController("")
export class TestController {
	@Inject()
	private userService: UsersService;
	@Inject()
	private testService: TestService;
	@Inject()
	private testRunnerService: TestsRunner;
	@Inject()
	private buildsService: BuildsService;

	@Post("/tests/actions/save.temp")
	async saveTempTest(@Body() body: { events: Array<iAction> }) {
		if (!body.events) throw new BadRequestError("No events provided");

		const result = await this.testService.saveTempTest(body.events);

		return { insertId: result.insertId };
	}

	@Get("/tests/actions/get.temp")
	async getTempTest(@QueryParams() params: { id: string }) {
		if (!params.id) throw new BadRequestError("No id provided");

		const result = await this.testService.getTempTest(params.id);

		return { events: result.events };
	}

	@Get("/projects/:project_id/tests/")
	async getList(
		@Param("project_id") projectId: number,
		@QueryParams() params: { search?: string; status?: BuildReportStatusEnum; page?: number },
	): Promise<IProjectTestsListResponse & { availableAuthors: Array<Pick<KeysToCamelCase<IUserTable>, "name" | "email" | "id">> }> {
		if (!params.page) params.page = 0;

		const testsListData = await this.testService.getTestsInProject(projectId, true, params);
		const testsList = testsListData.list.map((testData) => {
			const videoUrl = testData.featuredVideoUrl ? testData.featuredVideoUrl : null;
			const clipVideoUrl = testData.featuredClipVideoUrl ? testData.featuredClipVideoUrl : null;

			const isFirstRunCompleted = testData.draftBuildStatus === BuildStatusEnum.FINISHED;

			return {
				id: testData.id,
				testName: testData.name,
				tags: testData.tags,
				runAfter: testData.run_after,
				meta: testData.meta ? JSON.parse(testData.meta) : null,
				createdAt: new Date(testData.createdAt).getTime(),
				// @TODO: Remove this line
				videoURL: testData.draftBuildStatus === BuildStatusEnum.FINISHED ? videoUrl : null,
				clipVideoURL: testData.draftBuildStatus === BuildStatusEnum.FINISHED ? clipVideoUrl : null,
				// videoUrl: isUsingLocalStorage() && videoUrl ? videoUrl.replace("http://localhost:3001/", "/output/") : videoUrl,
				// @Note: Add support for taking random screenshots in case video is switched off
				imageURL: null,
				// @Note: Hardcoded for now, will be changed later
				isPassing: isFirstRunCompleted ? testData.draftBuildReportStatus === BuildReportStatusEnum.PASSED : null,
				// @Note: Hardcoded for now, will be changed later
				firstRunCompleted: isFirstRunCompleted,
				deleted: false,
				draftBuildId: testData.draftJobId,
			};
		});

		const availableAuthors = (await this.userService.getUsersInProject(projectId)).map((user) => {
			return { id: user.id, name: user.name, email: user.email };
		});

		return { totalPages: testsListData.totalPages, list: testsList, availableAuthors: availableAuthors, currentPage: params.page };
	}

	@Authorized()
	@Post("/projects/:project_id/tests/actions/run")
	async runProjectTests(
		@CurrentUser({ required: true }) user,
		@Body()
		body: {
			githubRepoName?: string;
			githubCommitId?: string;
			host?: string;
			disableBaseLineComparisions: boolean;
			baselineJobId: number | null;
			browsers?: Array<BrowserEnum>;
		},
		@Param("project_id") projectId: number,
	) {
		const meta = {
			disableBaseLineComparisions: !!body.disableBaseLineComparisions,
		};
		if (body.githubRepoName) {
			meta["github"] = {
				repoName: body.githubRepoName,
				commitId: body.githubCommitId,
			};
		}

		return this.testService.runTestsInProject(
			projectId,
			user.user_id,
			{ host: body.host ? body.host : "null" },
			meta,
			body.baselineJobId ? body.baselineJobId : null,
			body.browsers ? body.browsers : [BrowserEnum.CHROME],
		);
	}

	@Authorized()
	@Post("/tests/:test_id/actions/delete")
	async deleteTest(@CurrentUser({ required: true }) user, @Param("test_id") testId: number) {
		await this.testService.deleteTest(testId);

		return "Success";
	}

	@Authorized()
	@Post("/tests/:test_id/actions/update.steps")
	async updateTestActions(
		@CurrentUser({ required: true }) user,
		@Param("test_id") testId: number,
		@Body() body: {tempTestId: string},
	) {
		const tempTest = await this.testService.getTempTest(body.tempTestId);
		const result = await this.testService.updateTestSteps(testId, tempTest.events);

		return result.changedRows ? "Updated" : "No change";
	}

	// @TODO: Need strict type checks here. (Security Issue)
	@Authorized()
	@Post("/projects/:project_id/tests/actions/create")
	async createTest(
		@CurrentUser({ required: true }) user,
		@Param("project_id") projectId: number,
		@Body() body: Omit<ICreateTestPayload, "projectId" | "userId" | "events"> & { events?: Array<iAction>; tempTestId?: string },
	) {
		const { user_id } = user;

		let events = body.events;
		if (body.tempTestId) {
			const tempTest = await this.testService.getTempTest(body.tempTestId);
			events = tempTest.events;
		}

		if (!events) throw new Error("No events passed");
		if (!body.name) throw new Error("No name passed for the test");

		const testInsertRecord = await this.testService.createTest({
			...body,
			events: events,
			projectId: projectId,
			userId: user_id,
		});

		const testRecord = await this.testService.getTest(testInsertRecord.insertId);

		const buildRunInfo = await this.testRunnerService.runTests(
			await this.testService.getCompleteTestsArray(await this.testService.getFullTestArr([testRecord])),
			{
				userId: user_id,
				projectId: projectId,
				host: "null",
				status: BuildStatusEnum.CREATED,
				buildTrigger: BuildTriggerEnum.MANUAL,
				browser: [BrowserEnum.CHROME],
				isDraftJob: true,
				config: { shouldRecordVideo: true, testIds: [testRecord.id] },
				meta: { isDraftJob: true },
			},
		);

		await this.testService.linkToDraftBuild(buildRunInfo.buildId, testRecord.id);

		return testInsertRecord;
	}

	@Get("/tests/actions/get.template")
	async getTemplate(@QueryParams() params: { id: string }) {
		return this.testService.getTemplate(parseInt(params.id));
	}

	@Get("/tests/actions/get.templates")
	async getTemplates(@QueryParams() params: { name: string }) {
		return this.testService.getTemplates(params.name);
	}

	@Authorized()
	@Post("/tests/:test_id/actions/edit")
	async editTest(@CurrentUser({ required: true }) user, @Param("test_id") testId: number, @Body() body: { name: string; tags: string; runAfter: number }) {
		const result = await this.testService.updateTest(testId, {
			name: body.name,
			tags: body.tags,
			runAfter: body.runAfter,
		});

		return result.changedRows ? "Updated" : "No change";
	}

	@Authorized()
	@Post("/tests/:test_id/actions/update.meta")
	async updateTestMeta(@Param("test_id") testId: number, @Body() body: { meta: any }) {
		if (typeof body.meta !== "object") throw new BadRequestError("meta is not JSON compatible");
		const testRecord = await this.testService.getTest(testId);
		const finalMeta = testRecord.meta ? { ...JSON.parse(testRecord.meta), ...body.meta } : body.meta;

		await this.testService.updateMeta(JSON.stringify(finalMeta), testId);
		return "Successful";
	}

	@Get("/tests/:test_id")
	async getTest(@Param("test_id") testId: number) {
		const testRecord = await this.testService.getFullTest(await this.testService.getTest(testId));
		if (!testRecord) throw new BadRequestError("No such test");

		const draftJob = await this.buildsService.getBuild(testRecord.draftJobId);

		return {
			...testRecord,
			events: JSON.parse(testRecord.events),
			hasFirstRunCompleted: draftJob.status === BuildStatusEnum.FINISHED,
		};
	}
}

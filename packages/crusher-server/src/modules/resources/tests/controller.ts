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
import { StorageManager } from "@modules/storage";
import { Auth } from "googleapis";
import axios from "axios";

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
	@Inject()
	private storageManager: StorageManager;

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

	private async getPublicUrl(url: string) {
		if (!url) return null;
		return url.startsWith("http") ? url : await this.storageManager.getUrl(url);
	}

	@Authorized()
	@Get("/tests/")
	async getUserTestsList(
		@CurrentUser({ required: true }) user,
		@QueryParams() params: { search?: string; status?: BuildReportStatusEnum; page?: any },
	): Promise<IProjectTestsListResponse> {
		if (!params.page) params.page = 0;

		if (params.page) params.page = parseInt(params.page!);

		const testsListData = await this.testService.getTests(true, { ...params, userId: user.user_id });

		console.log(testsListData);
		const testsList = await Promise.all(
			testsListData.list.map(async (testData) => {
				const videoUrl = testData.featuredVideoUrl ? testData.featuredVideoUrl : null;
				const clipVideoUrl = testData.featuredClipVideoUrl ? testData.featuredClipVideoUrl : null;

				const isFirstRunCompleted = testData.draftBuildStatus === BuildStatusEnum.FINISHED;

				return {
					id: testData.id,
					projectId: testData.projectId,
					testName: testData.name,
					tags: testData.tags,
					runAfter: testData.run_after,
					meta: testData.meta ? JSON.parse(testData.meta) : null,
					createdAt: new Date(testData.createdAt).getTime(),
					// @TODO: Remove this line
					videoURL: testData.draftBuildStatus === BuildStatusEnum.FINISHED ? await this.getPublicUrl(videoUrl) : null,
					clipVideoURL: testData.draftBuildStatus === BuildStatusEnum.FINISHED ? await this.getPublicUrl(clipVideoUrl) : null,
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
			}),
		);

		return { totalPages: testsListData.totalPages, list: testsList, currentPage: params.page };
	}

	@Get("/projects/:project_id/tests/")
	async getList(
		@Param("project_id") projectId: number,
		@QueryParams() params: { search?: string; status?: BuildReportStatusEnum; page?: any },
	): Promise<IProjectTestsListResponse & { availableAuthors: Array<Pick<KeysToCamelCase<IUserTable>, "name" | "email" | "id">> }> {
		if (!params.page) params.page = 0;
		if (params.page) params.page = parseInt(params.page!);

		const folderData = await this.testService.getFolder(projectId);
		const testsListData = await this.testService.getTestsInProject(projectId, true, params);

		const testsList = await Promise.all(
			testsListData.list.map(async (testData) => {
				const videoUrl = testData.featuredVideoUrl ? testData.featuredVideoUrl : null;
				const clipVideoUrl = testData.featuredClipVideoUrl ? testData.featuredClipVideoUrl : null;

				const isFirstRunCompleted = testData.draftBuildStatus === BuildStatusEnum.FINISHED;

				return {
					id: testData.id,
					testName: testData.name,
					tags: testData.tags,
					folderId: testData.testFolder,
					runAfter: testData.run_after,
					meta: testData.meta ? JSON.parse(testData.meta) : null,
					createdAt: new Date(testData.createdAt).getTime(),
					// @TODO: Remove this line
					videoURL: testData.draftBuildStatus === BuildStatusEnum.FINISHED ? await this.getPublicUrl(videoUrl) : null,
					clipVideoURL: testData.draftBuildStatus === BuildStatusEnum.FINISHED ? await this.getPublicUrl(clipVideoUrl) : null,
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
			}),
		);

		const availableAuthors = (await this.userService.getUsersInProject(projectId)).map((user) => {
			return { id: user.id, name: user.name, email: user.email };
		});

		return { totalPages: testsListData.totalPages, folders: folderData, list: testsList, availableAuthors: availableAuthors, currentPage: params.page };
	}

	@Authorized()
	@Post("/projects/:project_id/tests/save.report")
	async saveReport(
		@CurrentUser({ required: true }) user,
		@Param("project_id") projectId: number,
		@Body() body: { testId: Array<number>; report: { [key: string]: {} } },
	): Promise<void> {
		// await this.testService.saveReport(projectId, body.testId, body.report);
	}

	@Authorized()
	@Post("/projects/:project_id/tests/actions/run")
	async runProjectTests(
		@CurrentUser({ required: true }) user,
		@Body()
		body: {
			proxyUrlsMap?: { [key: string]: { intercept: string | { regex: string }; tunnel: string } };
			githubRepoName?: string;
			githubCommitId?: string;
			host?: string;
			disableBaseLineComparisions: boolean;
			baselineJobId: number | null;
			folder?: string;
			folderIds?: string;
			testIds?: string;
			browsers?: Array<BrowserEnum>;
			context?: any;
		},
		@Param("project_id") projectId: number,
	) {
		if(body.host && body.host.includes("vercel.app")) {
			await new Promise(async (resolve, reject) => {
				try {
					let interval = undefined;
					let intervalCount = 0;
					const startPollFunc = async () => {
						const res = await axios.get(body.host);
						if(res.status === 302 && res.headers.location && res.headers.location.startsWith("/")) {
							intervalCount+=10000;
							if(intervalCount > 60000) {
								if(interval) clearInterval(interval);
								reject("Timeout");
							}

							return false;
						} else {
							if(interval) clearInterval(interval);
							resolve(true);	
						}
					}
					await startPollFunc();
					interval = setInterval(startPollFunc, 10000);
					
				} catch (e) {
					console.error("Error occured while waiting for Vercel to be ready", e);
					resolve(false);
				}
			})


		}
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
			{ host: body.host ? body.host : "null", context: body.context ? body.context : null },
			meta,
			body.baselineJobId ? body.baselineJobId : null,
			body.browsers ? body.browsers : [BrowserEnum.CHROME],
			body.folder ? body.folder : null,
			body.folderIds ? body.folderIds : null,
			body.testIds ? body.testIds : null,
			body.proxyUrlsMap ? body.proxyUrlsMap : null,
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
	async updateTestActions(@CurrentUser({ required: true }) user, @Param("test_id") testId: number, @Body() body: { tempTestId: string }) {
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
		@Body() body: Omit<ICreateTestPayload, "projectId" | "userId" | "events"> & {
			events?: Array<iAction>; shouldNotRunTests?: boolean; tempTestId?: string;
			proxyUrlsMap?: { [key: string]: { intercept: string | { regex: string }; tunnel: string } };
		},
	) {
		const { user_id } = user;
		const testInsertRecord = await this.testService.createAndRunTest(body, projectId, user_id);
		const testRecord = await this.testService.getTest(testInsertRecord.insertId);
		return testRecord;
	}

	@Authorized()
	@Post("/projects/:project_id/tests/actions/runDraftTest")
	async runDraftTest(
		@CurrentUser({ required: true }) user,
		@Param("project_id") projectId: number,
		@Body() body: { testId: number; proxyUrlsMap?: { [key: string]: { intercept: string | { regex: string }; tunnel: string } }; }
	) {
		const { user_id } = user;
		return this.testService.runDraftTest(body, projectId, user_id);
	}

	@Authorized()
	@Post("/projects/:project_id/folder/create")
	async createFolder(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number) {
		const folderInsertRecord = await this.testService.createFolder(projectId, "New Folder");

		return folderInsertRecord;
	}

	@Authorized()
	@Post("/projects/:project_id/folder/delete")
	async deleteFolder(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number, @Body() body: any) {
		const { folderId } = body;

		const folderDeleteRecord = await this.testService.deleteFolder(folderId);

		return folderDeleteRecord;
	}

	@Authorized()
	@Post("/projects/:project_id/folder/rename")
	async renameFolder(@CurrentUser({ required: true }) user, @Param("project_id") projectId: number, @Body() body: any) {
		const { folderId, name } = body;

		const folderUpdateRecord = await this.testService.renameFolder(folderId, name);

		return folderUpdateRecord;
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
	async editTest(@CurrentUser({ required: true }) user, @Param("test_id") testId: number, @Body() body: { name: string; testFolder: number | null }) {
		console.log(body.testFolder, typeof body.testFolder);
		const result = await this.testService.updateTest(testId, {
			name: body.name,
			testFolder: body.testFolder,
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

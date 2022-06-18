import { Container, Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { ProjectsService } from "@modules/resources/projects/service";
import { TestsRunner } from "@modules/runner";
import { BuildStatusEnum, BuildTriggerEnum, ICreateBuildRequestPayload } from "@modules/resources/builds/interface";
import { PLATFORM } from "@crusher-shared/types/platform";
import { ICreateTemplatePayload, ICreateTestPayload, ITemplatesTable, ITestTable } from "@modules/resources/tests/interface";
import { getSnakedObject, isOpenSourceEdition } from "@utils/helper";
import { iAction } from "@crusher-shared/types/action";
import { RedisManager } from "@modules/redis";
import { v4 as uuidv4 } from "uuid";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { BrowserEnum } from "@modules/runner/interface";
import { BuildReportStatusEnum } from "../buildReports/interface";
import { BadRequestError } from "routing-controllers";
import { merge } from "lodash";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { CodeTemplateService } from "../teams/codeTemplate/service";
@Service()
class TestService {
	private dbManager: DBManager;
	private redisManager: RedisManager;

	@Inject()
	private projectService: ProjectsService;
	@Inject()
	private testsRunner: TestsRunner;
	@Inject()
	private codeTemplateService: CodeTemplateService;

	constructor() {
		this.dbManager = Container.get(DBManager);
		this.redisManager = Container.get(RedisManager);
	}

	async saveTempTest(events: Array<iAction>): Promise<{ insertId: string }> {
		const keyId = `temp_test_${uuidv4()}`;
		await this.redisManager.set(keyId, JSON.stringify(events), { expiry: { type: "s", value: 10 * 60 } });
		return { insertId: keyId };
	}

	async getTempTest(tempTestId): Promise<{ events: Array<iAction> }> {
		const result = await this.redisManager.get(tempTestId);
		return { events: JSON.parse(result) };
	}

	// Modifies the events actions object directly
	private async handleTemplateActions(templateActions: Array<iAction>, projectId: number, userId: number) {
		const promiseArr = [];
		for (const templateAction of templateActions) {
			if (templateAction.payload.meta && templateAction.payload.meta.id) {
				// Do nothing
				continue;
			}

			promiseArr.push(
				this.createTemplate({ name: templateAction.name, events: templateAction.payload.meta.actions, projectId, userId }).then((insertRecord) => {
					templateAction.payload.meta.id = insertRecord.insertId;
					delete templateAction.payload.meta.actions;
					return true;
				}),
			);
		}

		return Promise.all(promiseArr);
	}

	async createTest(testInfo: Omit<ICreateTestPayload, "events"> & { events: Array<iAction> }): Promise<{ insertId: number }> {
		const templateActions = testInfo.events.filter((event) => event.type === ActionsInTestEnum.RUN_TEMPLATE);
		await this.handleTemplateActions(templateActions, testInfo.projectId, testInfo.userId);

		return this.dbManager.insert(
			`INSERT INTO public.tests (project_id, name, events, user_id, featured_video_url, featured_screenshot_url) VALUES (?, ?, ?, ?, ?, ?)`,
			[
				testInfo.projectId,
				testInfo.name,
				JSON.stringify(testInfo.events),
				testInfo.userId,
				testInfo.featuredVideoUrl ? testInfo.featuredVideoUrl : null,
				testInfo.featuredScreenshotUrl ? testInfo.featuredScreenshotUrl : null,
			],
		);
	}

	async createAndRunTest(payload: { tempTestId?: any; name: string; shouldNotRunTests?: boolean; events?: any }, projectId: number, userId: number) {
		let events = payload.events || [];
		if (payload.tempTestId) {
			const tempTest = await this.getTempTest(payload.tempTestId);
			events = tempTest.events;
		}

		if (!events && !events.length) throw new Error("No events passed");
		if (!payload.name) throw new Error("No name passed for the test");

		const testInsertRecord = await this.createTest({
			...(payload as any),
			events: events,
			projectId: projectId,
			userId: userId,
		});


		if(payload.shouldNotRunTests) { return testInsertRecord; }
		const testRecord = await this.getTest(testInsertRecord.insertId);

		const buildRunInfo = await this.testsRunner.runTests(await this.getCompleteTestsArray(await this.getFullTestArr([testRecord])), {
			userId: userId,
			projectId: projectId,
			host: "null",
			status: BuildStatusEnum.CREATED,
			buildTrigger: BuildTriggerEnum.MANUAL,
			browser: [BrowserEnum.CHROME],
			isDraftJob: true,
			config: { shouldRecordVideo: true, testIds: [testRecord.id] },
			meta: { isDraftJob: true },
		});

		await this.linkToDraftBuild(buildRunInfo.buildId, testRecord.id);

		return testInsertRecord;
	}

	async updateTestSteps(testId: number, steps: Array<iAction>) {
		return this.dbManager.update(`UPDATE public.tests SET events = ? WHERE id = ?`, [JSON.stringify(steps), testId]);
	}

	async linkToDraftBuild(buildId: number, testId: number) {
		return this.dbManager.update("UPDATE public.tests SET draft_job_id = ? WHERE id = ?", [buildId, testId]);
	}

	async updateTest(testId: number, newInfo: { name: string; testFolder: number }) {
		const { name, testFolder } = newInfo;
		return this.dbManager.update(`UPDATE public.tests SET name = ?, test_folder = ? WHERE id = ?`, [name, testFolder, testId]);
	}

	async runTestsInProject(
		projectId: number,
		userId: number,
		customTestsConfig: Partial<ICreateBuildRequestPayload> = {},
		buildMeta: { github?: { repoName: string; commitId: string }; disableBaseLineComparisions?: boolean } = {},
		overideBaseLineBuildId: number | null = null,
		browsers = [BrowserEnum.CHROME],
		folder = null,
		folderIds = null,
		testIds = null,
		proxyUrlsMap?: { [key: string]: { intercept: string | { regex: string }; tunnel: string } },
	) {
		console.log("Folder is", folder);
		console.log("FolderIds is", folderIds);
		console.log("TestIds is", testIds);
		const testsData = await this.getTestsInProject(projectId, true, { folder: folder, folderIds: folderIds, testIds: testIds });
		console.log("Test list is", testsData);
		if (!testsData.list.length) return;

		const projectRecord = await this.projectService.getProject(projectId);

		const meta: { isProjectLevelBuild: boolean; github?: { repoName: string }; disableBaseLineComparisions?: boolean } = {
			isProjectLevelBuild: true,
			disableBaseLineComparisions: !!buildMeta.disableBaseLineComparisions,
		};
		if (buildMeta.github) {
			meta.github = buildMeta.github;
		}

		return this.testsRunner.runTests(
			await this.getFullTestArr(testsData.list),
			merge(
				{
					userId: userId,
					projectId: projectId,
					host: "null",
					status: BuildStatusEnum.CREATED,
					buildTrigger: BuildTriggerEnum.MANUAL,
					browser: browsers,
					isDraftJob: false,
					config: { proxyUrlsMap: proxyUrlsMap, shouldRecordVideo: true, testIds: testsData.list.map((test) => test.id) },
					meta: meta,
				},
				customTestsConfig,
			),
			overideBaseLineBuildId ? overideBaseLineBuildId : projectRecord.baselineJobId,
		);
	}

	@CamelizeResponse()
	async getCompleteTestInfo(testId: number) {
		return this.dbManager.fetchSingleRow(
			`SELECT tests.*, projects.id as project_id, projects.name as project_name, users.id as user_id, users.name as user_name FROM public.tests, public.projects, public.users WHERE tests.id = ? AND tests.project_id = projects.id AND users.id=tests.user_id`,
			[testId],
		);
	}

	@CamelizeResponse()
	private _runCamelizeFetchAllQuery(query, values) {
		return this.dbManager.fetchAllRows(query, values);
	}

	async getTests(
		findOnlyActiveTests = false,
		filter: {
			userId?: number;
			projectId?: number;
			search?: string;
			status?: BuildReportStatusEnum;
			page?: number;
			folder?: string;
			folderIds?: string;
			testIds?: string;
		} = {},
	) {
		const PER_PAGE_LIMIT = 15;

		let additionalSelectColumns = "";
		let additionalFromSource = "";
		const queryParams: Array<any> = [];
		if (filter.search) {
			additionalSelectColumns += "ts_rank_cd(to_tsvector(COALESCE(commit_name, '')), query) as rank";
			additionalFromSource += `plainto_tsquery(?) query`;
			queryParams.push(filter.search);
		}

		let query = `SELECT tests.*, tests.project_id project_id, tests.draft_job_id as draft_job_id, tests.featured_clip_video_url as featured_clip_video_url, tests.featured_video_url as featured_video_url, users.id  as user_id, users.name as user_name, jobs.status as draft_build_status, job_reports.status as draft_build_report_status ${
			additionalSelectColumns ? `, ${additionalSelectColumns}` : ""
		} FROM public.tests, public.users, public.jobs, public.job_reports ${additionalFromSource ? `, ${additionalFromSource}` : ""} WHERE ${
			filter.projectId ? `tests.project_id = ? AND` : ""
		} ${filter.userId ? `users.id = ? AND` : ""} users.id = tests.user_id AND jobs.id = tests.draft_job_id AND job_reports.id = jobs.latest_report_id`;

		if (filter.projectId) {
			queryParams.push(filter.projectId);
		}
		if (filter.userId) {
			queryParams.push(filter.userId);
		}
		let page = 0;
		if (filter.page) page = filter.page;

		if (findOnlyActiveTests) {
			query += " AND tests.deleted = ?";
			queryParams.push(findOnlyActiveTests ? false : true);
		}

		if (filter.status) {
			query += " AND job_reports.status = ?";
			queryParams.push(filter.status);
		}

		if (filter.search) {
			query += ` AND to_tsvector(COALESCE(tests.name, '')) @@ query`;
		}

		const totalRecordCountQuery = `SELECT COUNT(*) count FROM (${query}) custom_query`;
		const totalRecordCountQueryResult = await this.dbManager.fetchSingleRow(totalRecordCountQuery, queryParams);

		if (filter.folder) {
			const folders = await this.getFolder(filter.projectId, { name: filter.folder });
			if (folders.length) {
				// Filter tests belong to one of the folders array
				const folderIdArr = folders.map((folder) => `${folder.id}`);
				query += ` AND test_folder IN (${new Array(folderIdArr.length).fill("?").join(",")})`;
				queryParams.push(...folderIdArr);
			}
		} else if (filter.folderIds) {
			const folders = filter.folderIds.split(",").map((folderId) => parseInt(folderId));
			if (folders.length) {
				// Filter tests belong to one of the folders array
				const folderIdArr = folders.map((folder) => `${folder}`);
				query += ` AND test_folder IN (${new Array(folderIdArr.length).fill("?").join(",")})`;
				queryParams.push(...folderIdArr);
			}
		}
		if (filter.testIds) {
			const testIdArr = filter.testIds.split(",").map((testId) => parseInt(testId));
			if (testIdArr.length) {
				// Filter tests belong to one of the folders array
				const testIdArrStr = testIdArr.map((testId) => `${testId}`);
				query += ` AND tests.id IN (${new Array(testIdArrStr.length).fill("?").join(",")})`;
				queryParams.push(...testIdArrStr);
			}
		}

		if (filter.search) {
			query += " ORDER BY tests.created_at DESC, rank DESC";
		} else {
			query += " ORDER BY tests.created_at DESC";
		}

		if (filter.page !== null && filter.page !== undefined && filter.page !== -1) {
			query += " LIMIT ? OFFSET ?";
			// Weird bug in node-mysql2
			// https://github.com/sidorares/node-mysql2/issues/1239#issuecomment-760086130
			queryParams.push(`${PER_PAGE_LIMIT}`);
			queryParams.push(`${filter.page * PER_PAGE_LIMIT}`);
		}

		return { totalPages: Math.ceil(totalRecordCountQueryResult.count / PER_PAGE_LIMIT), list: await this._runCamelizeFetchAllQuery(query, queryParams) };
	}

	@CamelizeResponse()
	async getFolder(projectId: number, filter: { name?: string } = {}) {
		let query = `SELECT id, name FROM public.tests_folder WHERE project_id = ?`;
		const queryParams: Array<any> = [projectId];
		if (filter.name) {
			const namesArray = filter.name.split(",");
			query += ` AND name IN (${new Array(namesArray.length).fill("?").join(",")})`;
			queryParams.push(...namesArray);
		}
		return this.dbManager.fetchAllRows(query, queryParams);
	}

	@CamelizeResponse()
	async createFolder(projectId: number, name: string) {
		return this.dbManager.insert(`INSERT INTO public.tests_folder (project_id, name) VALUES (?, ?)`, [projectId, name]);
	}

	@CamelizeResponse()
	async renameFolder(folderId: number, name: string) {
		return this.dbManager.update(`UPDATE public.tests_folder SET name = ? WHERE id = ?`, [name, folderId]);
	}

	@CamelizeResponse()
	async deleteFolder(folderId: number) {
		return this.dbManager.delete(`DELETE FROM public.tests_folder WHERE id = ?`, [folderId]);
	}

	async getTestsInProject(
		projectId: number,
		findOnlyActiveTests = false,
		filter: { search?: string; status?: BuildReportStatusEnum; page?: number; folder?: string; folderIds?: string; testIds?: string } = {},
	) {
		return this.getTests(findOnlyActiveTests, { ...filter, projectId });
	}

	async deleteTest(testId: number) {
		return this.dbManager.update(`UPDATE public.tests SET deleted = ? WHERE id = ?`, [true, testId]);
	}

	async updateMeta(meta: string, testId: number) {
		return this.dbManager.update("UPDATE public.tests SET meta = ? WHERE id = ?", [meta, testId]);
	}

	@CamelizeResponse()
	async getTest(testId: number): Promise<KeysToCamelCase<ITestTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.tests WHERE id = ?", [testId]);
	}

	// With template actions included
	@CamelizeResponse()
	async getFullTest(testRecord: KeysToCamelCase<ITestTable>): Promise<KeysToCamelCase<ITestTable>> {
		const actions = JSON.parse(testRecord.events);
		const templateActions = actions.filter((action) => action.type === ActionsInTestEnum.RUN_TEMPLATE);
		const customCodeActions = actions.filter((action) => action.type === ActionsInTestEnum.CUSTOM_CODE);
		await Promise.all(
			templateActions.map(async (action) => {
				if (action.payload.meta.id) {
					const template = await this.getTemplate(action.payload.meta.id);
					action.payload.meta.actions = JSON.parse(template.events);
				}
			}),
		);

		await Promise.all(
			customCodeActions.map(async (customCode) => {
				if (customCode.payload.meta.templateId) {
					const template = await this.codeTemplateService.get(customCode.payload.meta.templateId);
					if (template) {
						customCode.payload.meta.script = template.code;
					}
				}
			}),
		);

		testRecord.events = JSON.stringify(actions);
		return testRecord;
	}

	async getFullTestArr(testRecords: Array<KeysToCamelCase<ITestTable>>): Promise<Array<KeysToCamelCase<ITestTable>>> {
		return Promise.all(testRecords.map((testRecord) => this.getFullTest(testRecord)));
	}

	async addFeaturedVideo(featuredVideoUrl: string, lastSecondsClipVideoUrl: string, testId: number): Promise<{ insertId: number }> {
		return this.dbManager.update("UPDATE public.tests SET featured_video_url = ?, featured_clip_video_url = ? WHERE id = ?", [
			featuredVideoUrl,
			lastSecondsClipVideoUrl,
			testId,
		]);
	}

	@CamelizeResponse()
	async getTestsFromIdList(testIds: Array<number>): Promise<Array<KeysToCamelCase<ITestTable>>> {
		return this.dbManager.fetchAllRows(`SELECT * FROM public.tests WHERE id IN (${new Array(testIds.length).fill("?").join(", ")})`, [...testIds]);
	}

	private async _fillMapWithTestDependencies(testsMap: any, test: KeysToCamelCase<ITestTable>) {
		const actions = test.events;
		const actionsArray = JSON.parse(actions);

		const runAfterTestAction = actionsArray.find((event) => event.type === ActionsInTestEnum.RUN_AFTER_TEST);
		if (runAfterTestAction) {
			const runAfterTestId = runAfterTestAction.payload.meta.value;
			if (runAfterTestId) {
				const runAfterTest = testsMap[runAfterTestId];
				if (!runAfterTest) {
					testsMap[runAfterTestId] = await this.getTest(runAfterTestId);
					await this._fillMapWithTestDependencies(testsMap, await this.getTest(runAfterTestId));
				}
			}
		}
	}
	// Specifically for run after this test
	async getCompleteTestsArray(tests: Array<KeysToCamelCase<ITestTable>>): Promise<Array<KeysToCamelCase<ITestTable>>> {
		const testsMap = tests.reduce((acc, test) => {
			return { ...acc, [test.id]: test };
		}, {});

		for (const test of tests) {
			await this._fillMapWithTestDependencies(testsMap, test);
		}

		return Object.values(testsMap);
	}

	async createTemplate(payload: Omit<ICreateTemplatePayload, "events"> & { events: Array<iAction> }) {
		return this.dbManager.insert("INSERT INTO public.templates (name, events, project_id, user_id) VALUES (?, ?, ?, ?)", [
			payload.name,
			JSON.stringify(payload.events),
			payload.projectId ? payload.projectId : null,
			payload.userId ? payload.userId : null,
		]);
	}

	@CamelizeResponse()
	async getTemplates(name: string): Promise<Array<KeysToCamelCase<ITemplatesTable>>> {
		return this.dbManager.fetchAllRows(`SELECT * FROM public.templates WHERE name LIKE ?`, [name ? `%${name}%` : "%"]);
	}

	@CamelizeResponse()
	async getTemplate(id: number): Promise<KeysToCamelCase<ITemplatesTable>> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM public.templates WHERE id = ?`, [id]);
	}
}

export { TestService };

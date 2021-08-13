import { Container, Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { ProjectsService } from "@modules/resources/projects/service";
import { TestsRunner } from "@modules/runner";
import { BuildStatusEnum, BuildTriggerEnum } from "@modules/resources/builds/interface";
import { PLATFORM } from "@crusher-shared/types/platform";
import { ICreateTestPayload, ITestTable } from "@modules/resources/tests/interface";
import { getSnakedObject } from "@utils/helper";
import { iAction } from "@crusher-shared/types/action";
import { RedisManager } from "@modules/redis";
import { v4 as uuidv4 } from "uuid";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { BrowserEnum } from "@modules/runner/interface";

@Service()
class TestService {
	private dbManager: DBManager;
	private redisManager: RedisManager;

	@Inject()
	private projectService: ProjectsService;
	@Inject()
	private testsRunner: TestsRunner;

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

	async createTest(testInfo: Omit<ICreateTestPayload, "events"> & { events: Array<iAction> }): Promise<{ insertId: number }> {
		return this.dbManager.insert(
			`INSERT INTO tests SET project_id = ?, name = ?, events = ?, user_id = ?, featured_video_url = ?, featured_screenshot_url = ?`,
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

	async linkToDraftBuild(buildId: number, testId: number) {
		return this.dbManager.update("UPDATE tests SET draft_job_id = ? WHERE id = ?", [buildId, testId]);
	}

	async updateTest(testId: number, newInfo: { name: string }) {
		return this.dbManager.update(`UPDATE tests SET name = ? WHERE id = ?`, [newInfo.name, testId]);
	}

	async runTestsInProject(projectId: number, userId: number) {
		const tests = await this.getTestsInProject(projectId, true);

		return this.testsRunner.runTests(tests, {
			userId: userId,
			projectId: projectId,
			host: "null",
			status: BuildStatusEnum.CREATED,
			buildTrigger: BuildTriggerEnum.MANUAL,
			browser: BrowserEnum.ALL,
		});
	}

	async getCompleteTestInfo(testId: number) {
		return this.dbManager.fetchSingleRow(
			`SELECT tests.*, projects.id projectId, projects.name projectName, users.id userId, users.name userName FROM tests, projects, users WHERE tests.id = ? AND tests.project_id = projects.id AND users.id=tests.user_id`,
			[testId],
		);
	}

	async getTestsInProject(projectId: number, findOnlyActiveTests = false) {
		return this.dbManager.fetchAllRows(
			`SELECT tests.*, tests.featured_video_url featuredVideoUrl, users.id userId, users.name userName, jobs.status draftBuildStatus, job_reports.status draftBuildReportStatus FROM tests, users, jobs, job_reports WHERE tests.project_id = ? AND users.id = tests.user_id AND jobs.id = tests.draft_job_id AND job_reports.id = jobs.latest_report_id` +
				(findOnlyActiveTests ? " AND tests.deleted = FALSE " : ""),
			[projectId],
		);
	}

	async deleteTest(testId: number) {
		return this.dbManager.update(`UPDATE tests SET deleted = ? WHERE id = ?`, [true, testId]);
	}

	async updateMeta(meta: string, testId: number) {
		return this.dbManager.update("UPDATE tests SET meta = ? WHERE id = ?", [meta, testId]);
	}

	@CamelizeResponse()
	async getTest(testId: number): Promise<KeysToCamelCase<ITestTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM tests WHERE id = ?", [testId]);
	}

	async addFeaturedVideo(featuredVideoUrl: string, testId: number): Promise<{ insertId: number }> {
		return this.dbManager.update("UPDATE tests SET featured_video_url = ? WHERE id = ?", [featuredVideoUrl, testId]);
	}
}

export { TestService };

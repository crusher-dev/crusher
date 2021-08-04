import { Container, Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { ProjectsService } from "@modules/resources/projects/service";
import { TestsRunner } from "@modules/runner";
import { BuildStatusEnum, BuildTriggerEnum } from "@modules/resources/builds/interface";
import { PLATFORM } from "@crusher-shared/types/platform";
import { ICreateTestPayload } from "@modules/resources/tests/interface";
import { getSnakedObject } from "@utils/helper";
import { iAction } from "@crusher-shared/types/action";
import { RedisManager } from "@modules/redis";
import { v4 as uuidv4 } from "uuid";

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

	async createTest(testInfo: Omit<ICreateTestPayload, "events"> & { events: Array<iAction> }) {
		return this.dbManager.insert(`INSERT INTO tests SET ?`, [
			getSnakedObject({
				projectId: testInfo.projectId,
				name: testInfo.name,
				events: JSON.stringify(testInfo.events),
				userId: testInfo.userId,
				featuredVideoUri: testInfo.featuredVideoUri,
				featuredScreenshotUri: testInfo.featuredScreenshotUri,
			}),
		]);
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
			trigger: BuildTriggerEnum.MANUAL,
			browser: PLATFORM.ALL,
		});
	}

	async getCompleteTestInfo(testId: number) {
		return this.dbManager.fetchSingleRow(
			`SELECT tests.*, projects.id projectId, projects.name projectName, users.id userId, users.first_name userFirstName, users.last_name userLastName FROM tests, projects, users WHERE tests.id = ? AND tests.project_id = projects.id AND users.id=tests.user_id`,
			[testId],
		);
	}

	async getTestsInProject(projectId: number, findOnlyActiveTests = false) {
		return this.dbManager.fetchAllRows(
			`SELECT tests.*, users.id userId, users.first_name userFirstName, users.last_name userLastName FROM tests, users WHERE tests.project_id = ? AND users.id = tests.user_id` +
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
}

export { TestService };

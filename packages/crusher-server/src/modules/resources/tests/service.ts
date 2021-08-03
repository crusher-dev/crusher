import { Container, Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { ProjectsService } from "@modules/resources/projects/service";
import { TestsRunner } from "@modules/runner";
import { BuildStatusEnum, BuildTriggerEnum } from "@modules/resources/builds/interface";
import { PLATFORM } from "@crusher-shared/types/platform";
import { ICreateTestPayload } from "@modules/resources/tests/interface";
import { getSnakedObject } from "@utils/helper";

@Service()
class TestService {
	private dbManager: DBManager;
	@Inject()
	private projectService: ProjectsService;
	@Inject()
	private testsRunner: TestsRunner;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createTest(testInfo: ICreateTestPayload) {
		return this.dbManager.insert(`INSERT INTO tests SET ?`, [getSnakedObject(testInfo)]);
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
}

export { TestService };

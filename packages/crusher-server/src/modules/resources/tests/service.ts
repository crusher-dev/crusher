import { Container, Inject, Service } from 'typedi';
import { DBManager } from '@modules/db';
import { CreateTestRequest } from '@core/interfaces/services/test/CreateTestRequest';
import { Test } from '@core/interfaces/db/Test';
import { ProjectService } from '@modules/resources/projects/service';
import { TestsRunner } from '@modules/runner';
import { BuildStatusEnum, BuildTriggerEnum } from '@modules/resources/builds/interface';
import { PLATFORM } from '@crusher-shared/types/platform';

@Service()
class TestService {
	private dbManager: DBManager;
	@Inject()
	private projectService: ProjectService;
	@Inject()
	private testsRunner: TestsRunner;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createTest(testInfo: CreateTestRequest) {
		const { testName, events, framework, code, projectId, userId, featured_video_uri, draft_id } = testInfo;

		return this.dbManager.insert(`INSERT INTO tests SET ?`, {
			name: testName,
			events: events,
			framework: framework,
			code: code,
			project_id: projectId,
			user_id: userId,
			featured_video_uri: featured_video_uri,
			draft_id: draft_id,
		});
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

	async findMembersOfProject(projectId: number) {
		return this.dbManager.fetchAllRows(
			"SELECT users.* FROM projects, users, teams WHERE projects.id = ? AND projects.team_id = teams.id AND users.team_id = teams.id",
			[projectId],
		);
	}

	async findProjectMembersOfTest(testId: number) {
		return this.dbManager.fetchAllRows(
			"SELECT users.* FROM tests, projects, users, teams WHERE tests.id = ? AND projects.id = tests.project_id AND projects.team_id = teams.id AND users.team_id = teams.id",
			[testId],
		);
	}

	async getTestsCountInProject(projectId: number): Promise<number> {
		const countRecord = await this.dbManager.fetchSingleRow("SELECT COUNT(*) as totalTests FROM tests WHERE project_id = ?", [projectId]);
		return countRecord.totalTests;
	}

	async markDeleted(testId: number) {
		return this.dbManager.fetchSingleRow("UPDATE tests SET deleted = TRUE WHERE id = ?", [testId]);
	}

	async getTest(testId: number): Promise<Test> {
		const test: Test = await this.dbManager.fetchSingleRow(`SELECT * FROM tests WHERE id= ?`, [testId]);
		if (test) {
			return test;
		} else {
			return null;
		}
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

	async updateTest(testName: string, projectId: number, code: string, testId: number) {
		const fieldsToUpdate = {};
		if (testName) {
			fieldsToUpdate["name"] = testName;
		}
		if (projectId) {
			fieldsToUpdate["project_id"] = projectId;
		}
		if (code) {
			fieldsToUpdate["code"] = code;
		}
		return this.dbManager.fetchSingleRow(`UPDATE tests SET ? WHERE id = ?`, [fieldsToUpdate, testId]);
	}

	async deleteTest(testId: number) {
		return this.dbManager.update(`UPDATE tests SET ? WHERE id = ?`, [{ deleted: true }, testId]);
	}

	async deleteAllTestsInProject(projectId: number) {
		return this.dbManager.fetchSingleRow(`DELETE  FROM tests WHERE tests.projectId = ?`, [projectId]);
	}
}

export { TestService };
import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";
import { TEAM_CREATED, TEAM_CREATION_FAILED } from "../../constants";
import { CreateTestRequest } from "../interfaces/services/test/CreateTestRequest";
import { Test } from "../interfaces/db/Test";

@Service()
export default class TestService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createTest(testInfo: CreateTestRequest) {
		const { testName, events, framework, code, projectId, userId, featured_video_uri, draft_id } = testInfo;

		return this.dbManager.insertData(`INSERT INTO tests SET ?`, {
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

	async findMembersOfProject(projectId: number) {
		return this.dbManager.fetchData(
			"SELECT users.* FROM projects, users, teams WHERE projects.id = ? AND projects.team_id = teams.id AND users.team_id = teams.id",
			[projectId],
		);
	}

	async findProjectMembersOfTest(testId: number) {
		return this.dbManager.fetchData(
			"SELECT users.* FROM tests, projects, users, teams WHERE tests.id = ? AND projects.id = tests.project_id AND projects.team_id = teams.id AND users.team_id = teams.id",
			[testId],
		);
	}

	async getTestsCountInProject(projectId: number): Promise<number> {
		const countRecord = await this.dbManager.fetchSingleRow("SELECT COUNT(*) as totalTests FROM tests WHERE project_id = ?", [projectId]);
		return countRecord.totalTests;
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

	async getAllTestsInProject(projectId: number) {
		return this.dbManager.fetchData(
			`SELECT tests.*, users.id userId, users.first_name userFirstName, users.last_name userLastName FROM tests, users WHERE tests.project_id = ? AND users.id = tests.user_id`,
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
		return this.dbManager.fetchSingleRow(`DELETE FROM tests WHERE id=?`, [testId]);
	}

	async deleteAllTestsInProject(projectId: number) {
		return this.dbManager.fetchSingleRow(`DELETE  FROM tests WHERE tests.projectId = ?`, [projectId]);
	}
}

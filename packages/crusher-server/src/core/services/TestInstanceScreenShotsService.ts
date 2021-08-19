import { Service, Container, Inject } from "typedi";
import { DBManager } from "@modules/db";
import { TEAM_CREATED, TEAM_CREATION_FAILED } from "../../constants";
import { TestInstanceScreenshotStatus } from "../interfaces/TestInstanceScreenshotStatus";
import TestInstanceService from "./TestInstanceService";
import { TestInstance } from "../interfaces/db/TestInstance";
import { Platform } from "../interfaces/Platform";
import { TestInstanceScreenshot } from "../interfaces/db/TestInstanceScreenshot";

@Service()
export default class TestInstanceScreenshotsService {
	private dbManager: DBManager;
	private testInstanceService: TestInstanceService;

	constructor() {
		this.dbManager = Container.get(DBManager);
		this.testInstanceService = Container.get(TestInstanceService);
	}

	async addScreenshot(details: TestInstanceScreenshot) {
		const { instance_id, name, url } = details;

		return this.dbManager.insert("INSERT INTO test_instance_screenshots SET ?", {
			instance_id: instance_id,
			name: name,
			url: url,
		});
	}

	async getAllScreenShotsOfInstance(instanceId): Promise<Array<TestInstanceScreenshot>> {
		return this.dbManager.fetchAllRows(`SELECT * FROM test_instance_screenshots WHERE instance_id = ?`, [instanceId]);
	}

	async getReferenceInstance(curInstanceId, jobId, platform = Platform.CHROME): Promise<TestInstance> {
		const instance: TestInstance = await this.testInstanceService.getTestInstance(curInstanceId);

		return this.dbManager.fetchSingleRow(
			`SELECT * FROM test_instances WHERE test_id = ? AND NOT(id=? AND job_id = ?) AND test_instances.platform = ? ORDER BY updated_at DESC LIMIT 1`,
			[instance.test_id, curInstanceId, jobId, platform],
		);
	}
}

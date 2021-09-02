import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { ICreateEnvironmentPayload, IEnvironmentTable } from "./interface";

@Service()
class ProjectEnvironmentService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getEnvironmentsList(projectId: number): Promise<Array<KeysToCamelCase<IEnvironmentTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM environments WHERE project_id = ?", [projectId]);
	}

	async createEnvironment(payload: ICreateEnvironmentPayload) {
		return this.dbManager.insert("INSERT INTO environments SET project_id = ?, name = ?, browser = ?, vars = ?", [
			payload.projectId,
			payload.name,
			payload.browser,
			JSON.stringify(payload.vars),
		]);
	}

	@CamelizeResponse()
	async getEnvironment(environmentId: number): Promise<IEnvironmentTable> {
		return this.dbManager.fetchSingleRow("SELECT * FROM environments WHERE id = ?", [environmentId]);
	}

	async deleteEnvironment(environmentId: number) {
		return this.dbManager.delete("DELETE FROM environments WHERE id = ?", [environmentId]);
	}
}

export { ProjectEnvironmentService };

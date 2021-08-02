import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { ICreateProjectPayload, IProjectRow, IProjectTable } from "@modules/resources/projects/interface";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

@Service()
class ProjectService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getProject(projectId: Pick<IProjectTable, "id">): Promise<KeysToCamelCase<IProjectTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM projects WHERE project_id = ?", [projectId]);
	}

	async createProject(payload: ICreateProjectPayload) {
		return this.dbManager.insert("INSERT INTO projects SET ?", [payload]);
	}
}

export { ProjectService };

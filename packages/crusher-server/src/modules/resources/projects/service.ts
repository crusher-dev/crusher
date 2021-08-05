import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { ICreateProjectEnvironmentPayload, ICreateProjectPayload, IProjectEnvironmentTable, IProjectTable } from "@modules/resources/projects/interface";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { getSnakedObject } from "@utils/helper";

@Service()
class ProjectsService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getProjectEnvironments(projectId: number): Promise<Array<KeysToCamelCase<IProjectEnvironmentTable>>> {
		return this.dbManager.fetchAllRows("SELECT * FROM project_hosts WHERE project_id = ?", [projectId]);
	}

	async createProjectEnvironment(environmentInfo: ICreateProjectEnvironmentPayload) {
		return this.dbManager.insert("INSERT INTO project_hosts SET url = ?, host_name = ?, project_id = ?, user_id = ?", [
			environmentInfo.url,
			environmentInfo.hostName,
			environmentInfo.projectId,
			environmentInfo.userId,
		]);
	}

	@CamelizeResponse()
	async getProject(projectId: number): Promise<KeysToCamelCase<IProjectTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM projects WHERE id = ?", [projectId]);
	}

	async createProject(payload: ICreateProjectPayload) {
		return this.dbManager.insert("INSERT INTO projects SET name = ?, team_id = ?, meta = ?", [payload.name, payload.teamId, payload.meta]);
	}

	async updateMeta(meta: string, projectId: number) {
		return this.dbManager.update("UPDATE projects SET meta = ? WHERE id = ?", [meta, projectId]);
	}
}

export { ProjectsService };

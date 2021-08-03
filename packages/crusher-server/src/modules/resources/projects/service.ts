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
		return this.dbManager.insert("INSERT INTO projects SET ?", [getSnakedObject(environmentInfo)]);
	}

	@CamelizeResponse()
	async getProject(projectId: number): Promise<KeysToCamelCase<IProjectTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM projects WHERE id = ?", [projectId]);
	}

	async createProject(payload: ICreateProjectPayload) {
		return this.dbManager.insert("INSERT INTO projects SET ?", [getSnakedObject(payload)]);
	}
}

export { ProjectsService };

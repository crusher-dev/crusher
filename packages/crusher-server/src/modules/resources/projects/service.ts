import { Inject, Service } from "typedi";
import { DBManager } from "@modules/db";
import { ICreateProjectEnvironmentPayload, ICreateProjectPayload, IProjectEnvironmentTable, IProjectTable } from "@modules/resources/projects/interface";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { KeysToCamelCase } from "@modules/common/typescript/interface";

@Service()
class ProjectsService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getProjectEnvironments(projectId: number): Promise<KeysToCamelCase<IProjectEnvironmentTable>[]> {
		return this.dbManager.fetchAllRows("SELECT * FROM project_hosts WHERE project_id = ?", [projectId]);
	}

	async createProjectEnvironment(environmentInfo: ICreateProjectEnvironmentPayload): Promise<{ insertId: number }> {
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

	@CamelizeResponse()
	async getProjects(teamId: number): Promise<KeysToCamelCase<IProjectTable>[]> {
		return this.dbManager.fetchAllRows("SELECT * FROM projects WHERE team_id = ?", [teamId]);
	}

	async createProject(payload: ICreateProjectPayload): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO projects SET name = ?, team_id = ?, meta = ?", [
			payload.name,
			payload.teamId,
			payload.meta ? JSON.stringify(payload.meta) : "",
		]);
	}

	async updateMeta(meta: string, projectId: number) {
		return this.dbManager.update("UPDATE projects SET meta = ? WHERE id = ?", [meta, projectId]);
	}

	async updateBaselineBuild(baseLineBuild: number, projectId: number) {
		return this.dbManager.update("UPDATE projects SET baseline_job_id = ? WHERE id = ?", [baseLineBuild, projectId]);
	}

	async updateProjectName(projectName: string, projectId: number) {
		return this.dbManager.update("UPDATE projects SET name = ? WHERE id = ?", [projectName, projectId]);
	}

	async updateVisualBaseline(visualBaseline: number, projectId: number) {
		return this.dbManager.update("UPDATE projects SET visual_baseline = ? WHERE id = ?", [visualBaseline, projectId]);
	}
}

export { ProjectsService };

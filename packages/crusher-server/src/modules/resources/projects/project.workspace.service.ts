import { DBManager } from "@modules/db";
import { Inject, Service } from "typedi";

@Service()
class ProjectWorkspaceService {
	@Inject()
	private dbManager: DBManager;

	async deleteWorkspace(projectId: number) {
		// @TODO: Add implementation here
		await this.dbManager.fetchAllRows("SET FOREIGN_KEY_CHECKS = 0; DELETE FROM projects WHERE id = ?; SET FOREIGN_KEY_CHECKS = 1;", [projectId]);
		return true;
	}
}

export { ProjectWorkspaceService };

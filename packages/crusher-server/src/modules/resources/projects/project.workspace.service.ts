import { DBManager } from "@modules/db";
import { Inject, Service } from "typedi";

@Service()
class ProjectWorkspaceService {
	@Inject()
	private dbManager: DBManager;

	async deleteWorkspace(projectId: number) {
		// @TODO: Add implementation here.
		// This in unsafe implemetatation and dangerious. Remove it asap
		await this.dbManager.fetchAllRows("SET FOREIGN_KEY_CHECKS = 0;", []);
		await this.dbManager.delete("DELETE FROM public.projects WHERE id = ?", [projectId]);
		await this.dbManager.fetchAllRows("SET FOREIGN_KEY_CHECKS = 1;", []);
		return true;
	}
}

export { ProjectWorkspaceService };

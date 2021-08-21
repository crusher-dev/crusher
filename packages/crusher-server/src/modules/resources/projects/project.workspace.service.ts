import { DBManager } from "@modules/db";
import { Inject, Service } from "typedi";

@Service()
class ProjectWorkspaceService {
	@Inject()
	private dbManager: DBManager;

	async deleteWorkspace(projectId: number) {
		// @TODO: Add implementation here
		return true;
	}
}

export { ProjectWorkspaceService };

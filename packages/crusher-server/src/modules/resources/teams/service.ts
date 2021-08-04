import { DBManager } from "@modules/db";
import { Inject, Service } from "typedi";

@Service()
class TeamsService {
	@Inject()
	private dbManager: DBManager;

	async updateMeta(meta: string, teamId: number) {
		return this.dbManager.update("UPDATE teams SET meta = ? WHERE id = ?", [meta, teamId]);
	}
}

export { TeamsService };

import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { Inject, Service } from "typedi";
import { ICreateTeamPayload, ITeamsTable } from "./interface";
@Service()
class TeamsService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async getTeam(teamId: number): Promise<KeysToCamelCase<ITeamsTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM teams WHERE id = ?", [teamId]);
	}

	async updateMeta(meta: string, teamId: number): Promise<{ insertId: number }> {
		return this.dbManager.update("UPDATE teams SET meta = ? WHERE id = ?", [meta, teamId]);
	}

	async createTeam(payload: ICreateTeamPayload): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO teams SET name = ?, team_email = ?, tier = ?, stripe_customer_id = ?", [
			payload.name,
			payload.teamEmail,
			payload.tier,
			payload.stripeCustomerId,
		]);
	}
}

export { TeamsService };

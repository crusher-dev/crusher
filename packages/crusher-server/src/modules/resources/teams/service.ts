import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { Inject, Service } from "typedi";
import { IUserTable } from "../users/interface";
import { UserTeamRoleEnum } from "../users/roles/team/interface";
import { ICreateTeamPayload, ITeamsTable } from "./interface";
import { v4 as uuidv4 } from "uuid";
@Service()
class TeamsService {
	@Inject()
	private dbManager: DBManager;

	async hasProject(projectId: number, teamId: number): Promise<boolean> {
		return !!(await this.dbManager.fetchSingleRow("SELECT * FROM projects WHERE id = ? AND team_id = ?", [projectId, teamId]));
	}

	@CamelizeResponse()
	async getTeam(teamId: number): Promise<KeysToCamelCase<ITeamsTable>> {
		return this.dbManager.fetchSingleRow("SELECT * FROM public.teams WHERE id = ?", [teamId]);
	}

	async updateMeta(meta: string, teamId: number): Promise<{ insertId: number }> {
		return this.dbManager.update("UPDATE public.teams SET meta = ? WHERE id = ?", [meta, teamId]);
	}

	async createTeam(payload: Omit<ICreateTeamPayload, "uuid">): Promise<{ insertId: number }> {
		return this.dbManager.insert("INSERT INTO public.teams(name, team_email, tier, stripe_customer_id, uuid) VALUES (?, ?, ?, ?, ?)", [
			payload.name,
			payload.teamEmail,
			payload.tier,
			payload.stripeCustomerId,
			uuidv4() + "_" + Date.now(),
		]);
	}

	@CamelizeResponse()
	async getUsersWithRolesInTeam(teamId: number): Promise<Array<KeysToCamelCase<IUserTable> & { role: UserTeamRoleEnum }>> {
		return this.dbManager.fetchAllRows(
			"SELECT users.*, user_team_roles.role as role FROM public.users, public.user_team_roles WHERE users.team_id = ? AND users.id = user_team_roles.user_id",
			[teamId],
		);
	}
}

export { TeamsService };

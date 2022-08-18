import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { ProjectsService } from "@modules/resources/projects/service";
import { Inject, Service } from "typedi";
import { IUserTeamRoleTable, ICreateUserTeamRole, UserTeamRoleEnum } from "./interface";

@Service()
class UserTeamRolesService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async get(userId: number, teamId: number): Promise<KeysToCamelCase<IUserTeamRoleTable>> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM public.user_team_roles WHERE user_id = ? AND team_id = ?`, [userId, teamId]);
	}

	async create(payload: ICreateUserTeamRole): Promise<{ insertId: number }> {
		return this.dbManager.insert(`INSERT INTO public.user_team_roles (user_id, team_id, role) VALUES (?, ?, ?)`, [
			payload.userId,
			payload.teamId,
			payload.role ? payload.role : UserTeamRoleEnum.MEMBER,
		]);
	}
}

export { UserTeamRolesService };

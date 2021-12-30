import { KeysToCamelCase } from "@modules/common/typescript/interface";
import { DBManager } from "@modules/db";
import { CamelizeResponse } from "@modules/decorators/camelizeResponse";
import { Inject, Service } from "typedi";
import { UserProjectRoleEnum, ICreateUserProjectRole, IUserProjectRoleTable } from "./interface";

@Service()
class UserProjectRolesService {
	@Inject()
	private dbManager: DBManager;

	@CamelizeResponse()
	async get(userId: number, projectId: number): Promise<KeysToCamelCase<IUserProjectRoleTable>> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM user_project_roles WHERE user_id = ? AND project_id = ?`, [userId, projectId]);
	}

	async create(payload: ICreateUserProjectRole): Promise<{ insertId: number }> {
		return this.dbManager.insert(`INSERT INTO user_project_roles SET user_id = ?, project_id = ?, role = ?`, [
			payload.userId,
			payload.projectId,
			payload.role || UserProjectRoleEnum.MEMBER,
		]);
	}
}

export { UserProjectRolesService };

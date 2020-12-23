import { Service, Container } from "typedi";
import DBManager from "../../manager/DBManager";
import { TEAM_ROLE_TYPES } from '@crusher-shared/types/db/teamRole';

@Service()
export default class UserProjectRoleV2Service {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async create(user_id: number, team_id: number, role: TEAM_ROLE_TYPES){
		return this.dbManager.insertData(`INSERT INTO user_team_roles SET ?`, {
			user_id,
			team_id,
			role
		});
	}

	async update(user_id: number, team_id: number, role: TEAM_ROLE_TYPES){
		return this.dbManager.fetchData(`UPDATE user_team_roles SET role = ? WHERE user_id = ? AND team_id = ?`,
			[role, user_id, team_id]
		);
	}
}

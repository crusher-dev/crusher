import { Service, Container } from "typedi";
import DBManager from "../../manager/DBManager";
import { PROJECT_ROLE_TYPES } from '@crusher-shared/types/db/projectRole';

@Service()
export default class UserTeamRoleV2Service {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async create(user_id: number, team_id: number, role: PROJECT_ROLE_TYPES){
		return this.dbManager.insertData(`INSERT INTO user_project_roles SET ?`, {
			user_id,
			team_id,
			role
		});
	}

	async update(user_id: number, team_id: number, role: PROJECT_ROLE_TYPES){
		return this.dbManager.fetchData(`UPDATE user_project_roles SET role = ? WHERE user_id = ? AND team_id = ?`,
			[role, user_id, team_id]
		);
	}
}

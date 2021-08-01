import { Service, Container } from "typedi";
import { DBManager } from "@modules/db";
import { iProjectRole, PROJECT_ROLE_TYPES } from "@crusher-shared/types/db/projectRole";

@Service()
export default class UserProjectRoleService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async get(user_id: number, project_id: number): Promise<iProjectRole> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM user_project_roles WHERE user_id = ? AND project_id = ?`, [user_id, project_id]);
	}

	async create(user_id: number, project_id: number, role: PROJECT_ROLE_TYPES) {
		return this.dbManager.insert(`INSERT INTO user_project_roles SET ?`, {
			user_id,
			project_id,
			role,
		});
	}

	async createForProjects(userId: number, projectsList: Array<number>, role: PROJECT_ROLE_TYPES) {
		for (let i = 0; i < projectsList.length; i++) {
			await this.create(userId, projectsList[i], role);
		}
		return true;
	}

	async update(user_id: number, project_id: number, role: PROJECT_ROLE_TYPES) {
		return this.dbManager.fetchAllRows(`UPDATE user_project_roles SET role = ? WHERE user_id = ? AND project_id = ?`, [role, user_id, project_id]);
	}
}

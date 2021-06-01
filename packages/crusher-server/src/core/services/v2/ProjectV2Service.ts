import { Container, Service } from "typedi";
import DBManager from "../../manager/DBManager";
import { iProject } from "@crusher-shared/types/db/project";
import { InsertRecordResponse } from "../../interfaces/services/InsertRecordResponse";

@Service()
export class ProjectV2Service {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async getAllProjectsOfTeam(teamId: number): Promise<Array<iProject>> {
		return this.dbManager.fetchData(`SELECT * FROM projects WHERE team_id = ?`, [teamId]);
	}

	async createProject(projectName: string, teamId: number): Promise<number> {
		const projectRecord = await this.dbManager.insertData("INSERT INTO projects SET ?", {
			name: projectName,
			team_id: teamId,
		});

		return projectRecord.insertId;
	}
}

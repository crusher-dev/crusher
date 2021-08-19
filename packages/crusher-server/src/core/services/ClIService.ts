import { Service, Container } from "typedi";
import { DBManager } from "@modules/db";
import { CliStatus } from "../interfaces/db/CliStatus";
import { InsertRecordResponse } from "../interfaces/services/InsertRecordResponse";

@Service()
export default class ClIService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async addCLIToken(cliToken: string): Promise<InsertRecordResponse> {
		return this.dbManager.insert(`INSERT INTO cli_status SET ?`, {
			token: cliToken,
			status: "Started",
		});
	}

	async updateTokenStatus(cliToken: string, userId: number, teamId: number) {
		return this.dbManager.fetchSingleRow('UPDATE cli_status SET ?, status = "completed" WHERE token=?', [{ user_id: userId, team_id: teamId }, cliToken]);
	}

	async getTokenInfo(cliToken: string): Promise<CliStatus> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM cli_status WHERE token = ?`, [cliToken]);
	}

	async getTokenByUserId(user_id: number) {
		return this.dbManager.fetchSingleRow(`SELECT * FROM cli_status WHERE user_id = ?`, [user_id]);
	}
}

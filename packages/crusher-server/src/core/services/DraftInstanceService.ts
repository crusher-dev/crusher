import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";
import { TEAM_CREATED, TEAM_CREATION_FAILED } from "../../constants";
import { DraftInstance } from "../interfaces/db/DraftInstance";
import { InstanceStatus } from "../interfaces/InstanceStatus";

@Service()
export default class DraftInstanceService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createNewDraftInstance(details: { code: string; draft_id: number; platform: "CHROME" | "FIREFOX" | "SAFARI" | "ALL"; status: InstanceStatus }) {
		return this.dbManager.insertData(`INSERT INTO draft_instances SET ?, created_at = NOW()`, details);
	}

	async getRecentDraftInstance(draftId: number) {
		return this.dbManager.fetchSingleRow(`SELECT * FROM draft_instances WHERE draft_id = ? ORDER BY created_at DESC LIMIT 1`, [draftId]);
	}

	async updateDraftInstanceStatus(status: string, draftInstanceId: number) {
		return this.dbManager.fetchSingleRow(`UPDATE draft_instances SET status = ? WHERE id = ?`, [status, draftInstanceId]);
	}

	async getAllDraftInstances(draftId: number) {
		return this.dbManager.fetchData("SELECT * FROM draft_instances WHERE test_id = ?", [draftId]);
	}

	async getDraftInstance(draftInstanceId: number) {
		return this.dbManager.fetchSingleRow("SELECT * FROM draft_instances WHERE id = ?", [draftInstanceId]);
	}
}

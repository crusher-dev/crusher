import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";
import { TEAM_CREATED, TEAM_CREATION_FAILED } from "../../constants";
import { DraftInstance } from "../interfaces/db/DraftInstance";
import { InstanceStatus } from "../interfaces/InstanceStatus";
import { DraftInstanceResult } from "../interfaces/db/DraftInstanceResult";

@Service()
export default class DraftInstanceService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createDraftResult(details: DraftInstanceResult) {
		return this.dbManager.insertData(`INSERT INTO draft_instance_results SET ?`, details);
	}

	async getDraftResult(draftInstanceId: number) : Promise<DraftInstanceResult> {
		return this.dbManager.fetchSingleRow(`SELECT * FROM draft_instance_results WHERE instance_id = ? LIMIT 1`, [draftInstanceId]);
	}

	async updateInstanceRecording(draftInstanceId, video_url) {
		return this.dbManager.fetchSingleRow(`UPDATE draft_instance_results SET video_uri = ? WHERE instance_id = ?`, [video_url, draftInstanceId]);
	}

	async updateSavedTestRecordingFromDraft(testId, video_url) {
		return this.dbManager.fetchSingleRow(`UPDATE tests SET featured_video_uri = ? WHERE draft_id = ?`, [video_url, testId]);
	}
}

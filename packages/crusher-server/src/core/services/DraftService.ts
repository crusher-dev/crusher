import { Service, Container } from "typedi";
import { DBManager } from "@modules/db";
import { Draft } from "../interfaces/db/Draft";

@Service()
export default class DraftService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createDraftTest(details: Draft) {
		return this.dbManager.insert(`INSERT INTO drafts SET ?`, details);
	}

	async updateDraftTest(
		draftId: number,
		testName: string,
		code: string,
		events: string,
		framework: string,
		project_id: number,
		test_group_id: number,
		userId: number,
	) {
		const columnsToUpdate = {};

		if (testName) {
			columnsToUpdate["test_name"] = testName;
		}
		if (code) {
			columnsToUpdate["code"] = code;
		}
		if (events) {
			columnsToUpdate["events"] = JSON.stringify(events);
		}
		if (framework) {
			columnsToUpdate["framework"] = framework;
		}
		if (project_id) {
			columnsToUpdate["project_id"] = project_id;
		}
		if (test_group_id) {
			columnsToUpdate["test_group_id"] = test_group_id;
		}
		if (userId) {
			columnsToUpdate["user_id"] = userId;
		}

		return this.dbManager.fetchSingleRow("UPDATE drafts SET ? WHERE id=?", [columnsToUpdate, draftId]);
	}

	async getDraftTest(draftId: number) {
		return this.dbManager.fetchSingleRow(`SELECT * FROM drafts WHERE id = ?`, [draftId]);
	}

	async getLastDraftInstanceResult(draftId: number) {
		return this.dbManager.fetchSingleRow(
			`SELECT draft_instance_results.* FROM drafts, draft_instances, draft_instance_results WHERE drafts.id = ? AND draft_instances.draft_id = drafts.id AND draft_instance_results.instance_id = draft_instances.id ORDER BY draft_instances.created_at DESC LIMIT 1`,
			[draftId],
		);
	}

	async deleteDraftTest(draftId: number) {
		return this.dbManager.fetchSingleRow(`DELETE FROM drafts WHERE id = ?`, [draftId]);
	}
}

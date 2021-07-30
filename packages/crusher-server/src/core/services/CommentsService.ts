import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";
import { TEAM_CREATED, TEAM_CREATION_FAILED } from "../../constants";
import { DraftInstance } from "../interfaces/db/DraftInstance";
import { InstanceStatus } from "../interfaces/InstanceStatus";
import { DraftInstanceResult } from "../interfaces/db/DraftInstanceResult";
import { Comment } from "../interfaces/db/Comment";

@Service()
export default class CommentsService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async createComment(details: Comment) {
		return this.dbManager.insertData(`INSERT INTO comments SET ?`, details);
	}

	async getCommentsOfResultSet(resultSetId: number): Promise<Array<Comment>> {
		return this.dbManager.fetchData(`SELECT * FROM comments WHERE result_set_id = ? LIMIT 1`, [resultSetId]);
	}

	async getCommentsOfResultSetWithUserName(resultSetId: number): Promise<Array<Comment>> {
		return this.dbManager.fetchData(
			`SELECT comments.*, users.first_name userFirstName, users.last_name userLastName FROM comments, users WHERE comments.result_set_id = ? AND users.id = comments.user_id`,
			[resultSetId],
		);
	}

	async getCommentsOfScreenshotInResultSet(screenshotId: number, resultSetId: number) {
		return this.dbManager.fetchData(`SELECT * FROM comments WHERE screenshot_id = ? AND result_set_id = ? `, [screenshotId, resultSetId]);
	}

	async deleteComment(commentId: number) {
		return this.dbManager.fetchSingleRow(`DELETE FROM comments WHERE id = ?`, [commentId]);
	}

	async getCommentsInReportId(reportId: number) {
		const testInstanceComments = await this.dbManager.fetchData(
			`SELECT comments.*, users.first_name user_first_name, users.last_name user_last_name FROM users, comments WHERE comments.report_id = ? AND comments.user_id=users.id`,
			[reportId],
		);

		const commentsMap = testInstanceComments.reduce((prev, current) => {
			return {
				...prev,
				[current.result_id]: [...(prev && prev[current.result_id] ? prev[current.result_id] : []), current],
			};
		}, {});

		return commentsMap;
	}
}

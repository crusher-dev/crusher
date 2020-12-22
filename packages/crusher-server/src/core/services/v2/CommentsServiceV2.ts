import { Service, Container } from "typedi";
import DBManager from "../../manager/DBManager";

@Service()
export default class CommentsServiceV2 {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
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

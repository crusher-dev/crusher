import { Service, Container } from 'typedi';
import DBManager from '../../manager/DBManager';

@Service()
export default class CommentsServiceV2 {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async getCommentsBetweenJobs(jobId: number, referenceJobId: number) {
		const testInstanceComments = await this.dbManager.fetchData(
			`SELECT comments.*, users.first_name user_first_name, users.last_name user_last_name FROM users, comments INNER JOIN test_instance_result_sets tirs on comments.result_set_id = tirs.id WHERE tirs.job_id = ? AND tirs.target_job_id = ? AND users.id = comments.user_id;`,
			[jobId, referenceJobId],
		);

		const commentsMap = testInstanceComments.reduce((prev, current) => {
			return {
				...prev,
				[current.instance_id]: {
					...(prev && prev[current.instance_id] ? prev[current.instance_id] : {}),
					[current.screenshot_id]: [
						...(prev && prev[current.instance_id] && prev[current.instance_id][current.screenshot_id]
							? prev[current.instance_id][current.screenshot_id]
							: []),
						current,
					],
				},
			};
		}, {});

		return commentsMap;
	}
}

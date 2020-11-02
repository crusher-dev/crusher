import { Service, Container } from 'typedi';
import DBManager from '../../manager/DBManager';

@Service()
export default class TestInstanceResultsV2 {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async getResultsForJob(jobId: number, referenceJobId: number) {
		const testResults = await this.dbManager.fetchData(
			`SELECT test_instance_results.*, test_instance_result_sets.instance_id as instance_id, test_instance_result_sets.target_instance_id target_instance_id, test_instance_result_sets.status result_set_status, test_instance_result_sets.conclusion result_set_conclusion FROM test_instance_results INNER JOIN test_instance_result_sets ON test_instance_results.instance_result_set_id=test_instance_result_sets.id WHERE test_instance_result_sets.job_id = ? AND test_instance_result_sets.target_job_id = ?`,
			[jobId, referenceJobId],
		);

		const testResultsMap = testResults.reduce((prev, current) => {
			if (!prev[current.instance_id]) {
				return {
					...prev,
					[current.instance_id]: {
						instance_id: current.instance_id,
						reference_instance_id: current.target_instance_id,
						status: current.result_set_status,
						conclusion: current.result_set_conclusion,
						results: [current],
					},
				};
			}

			return {
				...prev,
				[current.instance_id]: {
					...prev[current.instance_id],
					results: [...prev[current.instance_id].results, current],
				},
			};
		}, {});

		return testResultsMap;
	}
}

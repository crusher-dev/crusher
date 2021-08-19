import { Service, Container, Inject } from "typedi";
import { DBManager } from "@modules/db";
import { TestInstanceResult } from "../interfaces/db/TestInstanceResult";
import { TestInstanceResultStatus } from "../interfaces/TestInstanceResultStatus";
import { JobBuild } from "../interfaces/db/JobBuild";
import TestInstanceResultSetsService from "./TestInstanceResultSetsService";
import { Platform } from "../interfaces/Platform";
import JobReportServiceV2 from "./v2/JobReportServiceV2";

@Service()
export default class TestInstanceService {
	private dbManager: DBManager;
	private testInstanceResultSetsService: TestInstanceResultSetsService;

	@Inject()
	private jobReportsService: JobReportServiceV2;

	constructor() {
		this.dbManager = Container.get(DBManager);
		this.testInstanceResultSetsService = Container.get(TestInstanceResultSetsService);
	}

	async createResult(details: TestInstanceResult) {
		return this.dbManager.insert(`INSERT INTO test_instance_results SET ?`, details);
	}

	async getResultsOfInstanceSet(setId: number): Promise<Array<TestInstanceResult>> {
		return this.dbManager.fetchAllRows(`SELECT * FROM test_instance_results WHERE instance_result_set_id = ?`, [setId]);
	}

	async markAllResultsAsApproved(jobId: number, referenceJobId: number) {
		const results = await this.dbManager.fetchAllRows(
			`SELECT test_instance_results.*, test_instance_result_sets.report_id report_id FROM test_instance_results LEFT JOIN test_instance_result_sets ON test_instance_result_sets.id = test_instance_results.instance_result_set_id WHERE test_instance_result_sets.job_id = ? AND test_instance_result_sets.target_job_id = ?`,
			[jobId, referenceJobId],
		);
		const updatePromisesArr = results.map((result) => {
			return (async () => {
				await this.dbManager.fetchSingleRow(`UPDATE test_instance_results SET status = ? WHERE id = ?`, [TestInstanceResultStatus.PASSED, result.id]);
				return {
					resultSetId: result.instance_result_set_id,
					reportId: result.report_id,
				};
			})();
		});

		const out = await Promise.all(updatePromisesArr);
		const resultSetArr = out.filter(function (item, pos) {
			return out.indexOf(item) == pos;
		});
		if (resultSetArr[0]) {
			await this.jobReportsService.updateTestStatusCount((resultSetArr[0] as any).reportId, {
				passed_test_count: resultSetArr.length,
				failed_test_count: 0,
				review_required_test_count: 0,
			});
		}
		for (let i = 0; i < resultSetArr.length; i++) {
			await this.testInstanceResultSetsService.updateResultSetStatus((resultSetArr[i] as any).resultSetId, (resultSetArr[i] as any).reportId, null);
		}
		return out;
	}

	async markAllPlatformTestResultsAsApproved(jobId: number, referenceJobId: number, platform: Platform) {
		const results = await this.dbManager.fetchAllRows(
			`SELECT test_instance_results.*, test_instance_result_sets.report_id report_id FROM test_instance_results LEFT JOIN test_instance_result_sets ON test_instance_result_sets.id = test_instance_results.instance_result_set_id INNER JOIN test_instances ON test_instances.id = test_instance_result_sets.instance_id WHERE test_instance_result_sets.job_id = ? AND test_instance_result_sets.target_job_id = ? AND test_instances.platform = ?`,
			[jobId, referenceJobId, platform],
		);
		const updatePromisesArr = results.map((result) => {
			return (async () => {
				await this.dbManager.fetchSingleRow(`UPDATE test_instance_results SET status = ? WHERE id = ?`, [
					TestInstanceResultStatus.PASSED,
					result.id,
					platform,
				]);
				return {
					resultSetId: result.instance_result_set_id,
					reportId: result.report_id,
				};
			})();
		});

		const out = await Promise.all(updatePromisesArr);
		const resultSetArr = out.filter(function (item, pos) {
			return out.indexOf(item) == pos;
		});
		if (resultSetArr[0]) {
			await this.jobReportsService.updateTestStatusCount((resultSetArr[0] as any).reportId, {
				passed_test_count: 0,
				failed_test_count: 0,
				review_required_test_count: 0,
			});
		}
		for (let i = 0; i < resultSetArr.length; i++) {
			await this.testInstanceResultSetsService.updateResultSetStatus((resultSetArr[i] as any).resultSetId, (resultSetArr[i] as any).reportId, null);
		}
		return out;
	}

	async markResultAsApproved(resultId: number, userId: number) {
		return this.dbManager.fetchSingleRow(`UPDATE test_instance_results SET status = ?, action_by = ? WHERE id = ?`, [
			TestInstanceResultStatus.PASSED,
			userId,
			resultId,
		]);
	}

	async markResultAsRejected(resultId: number, userId: number) {
		return this.dbManager.fetchSingleRow(`UPDATE test_instance_results SET status = ?, action_by = ? WHERE id = ?`, [
			TestInstanceResultStatus.FAILED,
			userId,
			resultId,
		]);
	}
}

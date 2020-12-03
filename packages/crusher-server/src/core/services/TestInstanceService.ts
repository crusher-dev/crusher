import { Service, Container } from 'typedi';
import DBManager from '../manager/DBManager';
import { TEAM_CREATED, TEAM_CREATION_FAILED } from '../../constants';
import { CreateTestInstanceRequest } from '../interfaces/services/test/CreateTestInstanceRequest';
import { Platform } from '../interfaces/Platform';
import JobsService from './JobsService';

@Service()
export default class TestInstanceService {
	private dbManager: DBManager;
	private jobsService: JobsService;
	constructor() {
		this.dbManager = Container.get(DBManager);
		this.jobsService = Container.get(JobsService);
	}

	async createNewTestInstance(details: CreateTestInstanceRequest) {
		const { jobId, testId, code, platform, host, status } = details;

		return this.dbManager.insertData(`INSERT INTO test_instances SET ?, created_at = NOW()`, {
			job_id: jobId,
			test_id: testId,
			code: code,
			platform: platform,
			host: host,
			status: status,
		});
	}

	async getAllInstancesOfTestToday(testId: number) {
		return this.dbManager.fetchData(
			`SELECT * FROM tests, test_instances WHERE test_instances.test_id = tests.id AND tests.id = ? AND DATE(test_instances.created_at) = CURDATE();`,
			[testId],
		);
	}

	async updateTestInstanceStatus(status: string, testInstanceId: number) {
		return this.dbManager.fetchSingleRow(`UPDATE test_instances SET status = ? WHERE id = ?`, [status, testInstanceId]);
	}

	// Sort by created_at DESC
	async getAllTestInstances(testId: number) {
		return this.dbManager.fetchData('SELECT * FROM test_instances WHERE test_id = ? ORDER BY created_at DESC', [testId]);
	}

	async getReferenceTestInstance(referenceJobId: number, testId: number, platform: any){
		return this.dbManager.fetchSingleRow(`SELECT * FROM test_instances WHERE job_id = ? AND test_id = ? AND platform = ?`, [referenceJobId, testId, platform])
	}

	async getTestInstance(testInstanceId: number) {
		return this.dbManager.fetchSingleRow('SELECT * FROM test_instances WHERE id = ?', [testInstanceId]);
	}

	async getAllTestInstancesFromJobId(jobId: number) {
		return this.dbManager.fetchData(
			'SELECT test_instances.*, tests.name test_name FROM test_instances  LEFT JOIN tests ON tests.id = test_instances.test_id WHERE job_id = ? ORDER BY created_at DESC',
			[jobId],
		);
	}

	async getAllTestInstancesByJobIdOfPlatform(jobId: number, platform: Platform) {
		return this.dbManager.fetchData(
			'SELECT tests.events as events, test_instances.* FROM test_instances, tests WHERE job_id = ? AND platform = ? AND tests.id = test_instances.test_id ORDER BY created_at DESC',
			[jobId, platform],
		);
	}

	async getAllInstancesWithResultByJobId(jobId: number, platform = Platform.CHROME, referenceJobId: number = null) {
		const job = await this.jobsService.getJob(jobId);

		return this.dbManager.fetchData(
			`SELECT test_instances.id instanceID, test_instance_results.id resultId, test_instances.job_id jobId, test_instance_result_sets.id resultSetId, test_instances.platform instancePlatfrom, tests.name testName, tests.id testId, test_instance_results.id testInstanceResultId, test_instance_results.diff_delta diffDelta, test_instance_results.diff_image_url diffUrl, test_instance_results.status resultStatus, test_instance_results.target_screenshot_id targetScreenshotId, test_instance_screenshots.id screenshotId, test_instance_screenshots.name screenshotName, test_instance_screenshots.url screenshotUrl FROM test_instances, test_instance_screenshots, tests, test_instance_result_sets LEFT JOIN test_instance_results ON test_instance_result_sets.id = test_instance_results.instance_result_set_id WHERE test_instances.job_id = ? AND test_instance_result_sets.instance_id = test_instances.id AND test_instance_result_sets.target_job_id = ? AND test_instance_screenshots.id = test_instance_results.screenshot_id AND tests.id =  test_instances.test_id AND test_instances.platform = ?`,
			[job.id, referenceJobId ? referenceJobId : job.id, platform],
		);
	}

	async getAllInstancesWithResultByJobIdWithoutPlatfom(jobId: number, referenceJobId: number = null) {
		const job = await this.jobsService.getJob(jobId);
		const referenceJob = await this.jobsService.getReferenceJob(job);

		return this.dbManager.fetchData(
			`SELECT test_instances.id instanceID, test_instance_results.id resultId, test_instances.job_id jobId, test_instance_result_sets.id resultSetId, test_instances.platform instancePlatfrom, tests.name testName, tests.id testId, test_instance_results.id testInstanceResultId, test_instance_results.diff_delta diffDelta, test_instance_results.diff_image_url diffUrl, test_instance_results.status resultStatus, test_instance_results.target_screenshot_id targetScreenshotId, test_instance_screenshots.id screenshotId, test_instance_screenshots.name screenshotName, test_instance_screenshots.url screenshotUrl FROM test_instances, test_instance_screenshots, tests, test_instance_result_sets LEFT JOIN test_instance_results ON test_instance_result_sets.id = test_instance_results.instance_result_set_id WHERE test_instances.job_id = ? AND test_instance_result_sets.instance_id = test_instances.id AND test_instance_result_sets.target_job_id = ? AND test_instance_screenshots.id = test_instance_results.screenshot_id AND tests.id =  test_instances.test_id`,
			[job.id, referenceJobId ? referenceJobId : referenceJob ? referenceJob.id : job.id],
		);
	}
}

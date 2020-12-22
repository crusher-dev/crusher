import { Service, Container } from "typedi";
import DBManager from "../manager/DBManager";
import { CreateProjectHostRequest } from "../interfaces/services/projectHosts/CreateProjectHostRequest";
import { ScreenshotComparisionRequest } from "../interfaces/services/screenshots/ScreenshotComparisionRequest";
import { ScreenShotComparisionStatus } from "../interfaces/ScreenShotComparisionStatus";

@Service()
export default class ScreenshotComparisionsService {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async saveComparision(details: ScreenshotComparisionRequest) {
		return this.dbManager.insertData(`INSERT INTO screenshot_comparisons SET ?`, {
			screenshot_id: details.screenshotId,
			reference_screenshot_id: details.referenceScreenshotId,
			status: details.status,
			reference_instance_id: details.referenceInstanceId,
			visual_diff_url: details.visualDiffUrl,
			visual_diff_delta: details.visualDiffDelta,
		});
	}

	async getScreenshotsWithComparision(instanceId, referenceInstanceId) {
		return this.dbManager.fetchData(
			`SELECT screenshot_comparisons.*, test_instance_screenshots.instance_id instance_id  FROM screenshot_comparisons,` +
				`test_instance_screenshots WHERE test_instance_screenshots.instance_id = ? AND test_instance_screenshots.id` +
				`= screenshot_comparisons.screenshot_id AND screenshot_comparisons.reference_instance_id = ?`,
			[instanceId, referenceInstanceId],
		);
	}

	async getFailedScreenshotsCount(jobId: number) {
		return this.dbManager.fetchSingleRow(
			`SELECT COUNT(screenshot_comparisons.status) as failedCount FROM jobs, test_instances,` +
				`test_instance_screenshots, screenshot_comparisons WHERE jobs.id=795 AND test_instances.job_id=jobs.id ` +
				`AND test_instance_screenshots.instance_id = test_instances.id AND ` +
				`screenshot_comparisons.screenshot_id = test_instance_screenshots.id ` +
				`AND screenshot_comparisons.status = 'FAILED'`,
			[jobId],
		);
	}
}
// SELECT screenshot_comparisons.*, test_instance_screenshots.instance_id instance_id  FROM screenshot_comparisons, test_instance_screenshots WHERE test_instance_screenshots.instance_id = ? AND test_instance_screenshots.id = screenshot_comparisons.screenshot_id AND screenshot_comparisons.reference_instance_id = ?

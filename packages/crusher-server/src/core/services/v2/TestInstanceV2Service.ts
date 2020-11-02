import { Service, Container } from 'typedi';
import DBManager from '../../manager/DBManager';

@Service()
export default class TestInstanceV2Service {
	private dbManager: DBManager;

	constructor() {
		this.dbManager = Container.get(DBManager);
	}

	async getTestInstancesMapWithMedia(jobId: number) {
		const testInstanceScreenshots = await this.dbManager.fetchData(
			`SELECT test_instance_screenshots.url as screenshot_url, test_instance_recordings.video_uri as video_uri, test_instance_screenshots.created_at as screenshot_created_at, test_instance_screenshots.id screenshot_id, test_instance_screenshots.name screenshot_name, test_instances.*, tests.name as test_name, tests.events as events  FROM tests, test_instances LEFT JOIN test_instance_screenshots ON test_instance_screenshots.instance_id = test_instances.id LEFT JOIN test_instance_recordings ON test_instance_recordings.test_instance_id = test_instances.id WHERE test_instances.job_id = ? AND tests.id = test_instances.test_id`,
			[jobId],
		);

		const testInstanceWithMediaMap = testInstanceScreenshots.reduce((prev, current) => {
			if (!prev[current.id]) {
				return {
					...prev,
					[current.id]: {
						id: current.id,
						job_id: current.job_id,
						test_id: current.test_id,
						test_name: current.test_name,
						events: current.events,
						status: current.status,
						code: current.code,
						platform: current.platform,
						host: current.host,
						recorded_video_uri: current.video_uri,
						created_at: current.created_at,
						updated_at: current.updated_at,
						images: current.screenshot_id
							? [
									{
										id: current.screenshot_id,
										url: current.screenshot_url,
										name: current.screenshot_name,
										created_at: current.screenshot_created_at,
									},
							  ]
							: [],
					},
				};
			}

			return {
				...prev,
				[current.id]: {
					...prev[current.id],
					images: current.screenshot_id
						? [
								...prev[current.id].images,
								{
									id: current.screenshot_id,
									url: current.screenshot_url,
									name: current.screenshot_name,
									created_at: current.screenshot_created_at,
								},
						  ]
						: prev[current.id].images,
				},
			};
		}, {});
		return testInstanceWithMediaMap;
	}
}

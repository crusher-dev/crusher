import { TestType } from "../interfaces/TestType";
import TestInstanceRecordingService from "../services/TestInstanceRecordingService";
import DraftInstanceResultsService from "../services/DraftInstanceResultsService";
import "reflect-metadata";

const testInstanceRecordingService = new TestInstanceRecordingService();
const draftInstanceResultsService = new DraftInstanceResultsService();

export class VideoEventsPostProcessor {
	static async onVideoProcessed(data) {
		const { processed, recordedVideoUrl, instanceId: instanceId, testId: testId, testType: testType } = data;
		if (processed && recordedVideoUrl) {
			if (testType === TestType.SAVED) {
				await testInstanceRecordingService.createTestInstanceRecording({
					test_instance_id: instanceId,
					video_uri: recordedVideoUrl,
					test_id: testId,
				});
			} else if (testType === TestType.DRAFT) {
				await draftInstanceResultsService.updateSavedTestRecordingFromDraft(testId, recordedVideoUrl);

				await draftInstanceResultsService.updateInstanceRecording(instanceId, recordedVideoUrl);
			}
		}
	}
}

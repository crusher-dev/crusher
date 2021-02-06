import { Job } from "bullmq";
import { VideoEventsPostProcessor } from "./videoEventsPostProcessor";

module.exports = (bullJob: Job) => {
	return VideoEventsPostProcessor.onVideoProcessed(bullJob.data);
};

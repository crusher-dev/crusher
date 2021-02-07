import { Job } from "bullmq";
import { VideoEventsPostProcessor } from "./videoEventsPostProcessor";

module.exports = async (bullJob: Job) => {
	console.log("GETTING VIDEO PROCESSED", bullJob.data);
	await VideoEventsPostProcessor.onVideoProcessed(bullJob.data);
	return true;
};

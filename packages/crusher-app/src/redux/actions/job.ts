import { JobInfo } from "@interfaces/JobInfo";
import { JobPlatform } from "@interfaces/JobPlatform";

export const SET_CURRENT_JOB_INFO = "SET_CURRENT_JOB_INFO";
export const SET_CURRENT_JOB_PLATFORM = "SET_CURRENT_JOB_PLATFORM";
export const ADD_COMMENT_TO_SCREENSHOT = "ADD_COMMENT_TO_SCREENSHOT";

export const setCurrentJobPlatform = (platform: JobPlatform) => ({
	type: SET_CURRENT_JOB_PLATFORM,
	platform: platform,
});

export const addCommentInRedux = (comment: string) => ({
	type: ADD_COMMENT_TO_SCREENSHOT,
	comment: comment,
});

export const setJobInfo = (platform: JobPlatform, jobInfo: JobInfo) => ({
	type: SET_CURRENT_JOB_INFO,
	platform: platform || "CHROME",
	job: jobInfo ? jobInfo.job : null,
	referenceJob: jobInfo ? jobInfo.referenceJob : null,
	comments: jobInfo ? jobInfo.comments : {},
	instances: jobInfo ? jobInfo.instances : {},
	results: jobInfo ? jobInfo.results : {},
});

import { JobInfo } from "@interfaces/JobInfo";

export const getCurrentJobReviewPlatform = (state) =>
	state.job.platform ? state.job.platform : "CHROME";
export const getCurrentJob = (state) => state.job.job;
export const getReferenceJob = (state) => state.job.referenceJob;
export const getCurrentJobComments = (state) =>
	state.job.comments ? state.job.comments : {};
export const getCurrentJobInstances = (state) =>
	state.job.instances ? state.job.instances : {};
export const getCurrentJobResults = (state) =>
	state.job.results ? state.job.results : {};
export const getInstanceResult = (instanceId) => (state) =>
	state.job.results ? state.job.results[instanceId] : {};

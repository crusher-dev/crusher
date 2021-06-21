import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";

export const getVisualDiffsJob = (jobId, headers = null) => {
	return backendRequest(`/job/getVisualDiffsWithFirstJob/${jobId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const getAllJobsOfProject = (projectId, category = 0, page = 1, headers = null) => {
	return backendRequest(`/v2/job/report/list/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
		payload: { page: page || 1, category },
	});
};

export const getPaginationEndpoint = (endpoint: string, payload: any, headers = null) => {
	return backendRequest(endpoint, {
		method: RequestMethod.GET,
		headers: headers,
		payload: payload,
	});
};

export const getAllProjectLogs = (projectId: number, headers = null) => {
	const mockUrl = "https://api.jsonbin.io/b/60bdbcf19fc30168f1c6714e"
	return backendRequest(mockUrl || `/job/getLogsOfProject/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const getMetaDashboardProjectInfo = (projectId: number, headers = null) => {
	const mockURL = "https://api.jsonbin.io/b/60bdbbbd92164b68bec2e230";

	return backendRequest(mockURL || `/projects/meta/dashboard/info/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

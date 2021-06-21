import { iAddMonitoringRequest } from "@crusher-shared/types/request/addMonitoringRequest";
import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { iMonitoringListResponse } from "@crusher-shared/types/response/monitoringListResponse";

export const _addMonitoring = (payload: iAddMonitoringRequest, projectId: number, headers = null) => {
	return backendRequest(`/monitoring/add/${projectId}`, {
		method: RequestMethod.POST,
		headers: headers,
		payload: payload,
	});
};

export const _getMonitoringList = (projectId: number, headers = null): Promise<iMonitoringListResponse[]> => {
	return backendRequest(`/monitoring/get/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const _runMonitoring = (monitoringId: number, headers = null) => {
	return backendRequest(`/monitoring/run/${monitoringId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { iProjectInfoResponse } from "@crusher-shared/types/response/projectInfoResponse";

export const _getProjectInfo = (projectId: number, headers?: any): Promise<iProjectInfoResponse> => {
	return backendRequest(`/v2/project/get/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const _updateProjectInfo = (info: { name: string }, projectId: number, headers?: any): Promise<any> => {
	return backendRequest(`/v2/project/update/${projectId}`, {
		method: RequestMethod.PUT,
		headers: headers,
		payload: { info },
	});
};

export const runTestsInProject = (projectId: number, headers?: any): Promise<any> => {
	return backendRequest(`/v2/project/run/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

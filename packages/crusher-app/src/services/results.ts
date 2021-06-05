import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";

export const approveResult = (resultSetId, resultId, headers = null) => {
	return backendRequest(`/testInstanceResult/approve/${resultSetId}/${resultId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const rejectResult = (resultSetId, resultId, headers = null) => {
	return backendRequest(`/testInstanceResult/disapprove/${resultSetId}/${resultId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

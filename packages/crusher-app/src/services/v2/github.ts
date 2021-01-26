import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { iListOfUserLoginConnectionsResponse } from "@crusher-shared/types/response/listOfUserLoginConnections";

export const _getUserConnectionsList = (
	headers: any = null,
): Promise<iListOfUserLoginConnectionsResponse> => {
	return backendRequest("/v2/user/connection/get", {
		method: RequestMethod.GET,
		headers: headers,
	});
};

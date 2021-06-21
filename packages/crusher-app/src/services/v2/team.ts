import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { iMemberInfoResponse } from "@crusher-shared/types/response/membersInfoResponse";

export const _getTeamMembers = (headers?: any): Promise<iMemberInfoResponse[]> => {
	return backendRequest("/v2/team/get/members", {
		method: RequestMethod.GET,
		headers: headers,
	});
};

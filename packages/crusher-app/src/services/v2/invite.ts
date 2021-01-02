import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { iInviteLinkResponse } from "@crusher-shared/types/response/inviteLinkResponse";

export const _inviteTeamMember = (
	emails: Array<string>,
	headers: any = null,
): Promise<iInviteLinkResponse> => {
	return backendRequest("/v2/invite/team/members", {
		method: RequestMethod.POST,
		headers: headers,
		payload: {
			emails,
		},
	});
};

export const _getInviteTeamMembersLink = (
	headers: any = null,
): Promise<iInviteLinkResponse> => {
	return backendRequest("/v2/invite/team/members", {
		method: RequestMethod.POST,
		headers: headers,
	});
};

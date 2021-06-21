import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { iInviteLinkResponse } from "@crusher-shared/types/response/inviteLinkResponse";

export const _inviteTeamMember = (emails: string[], headers: any = null): Promise<iInviteLinkResponse> => {
	return backendRequest("/v2/invite/team/members", {
		method: RequestMethod.POST,
		headers: headers,
		payload: {
			emails,
		},
	});
};

export const _getProjectMemberInviteLink = (projectId: number, headers: any = null): Promise<string> => {
	return backendRequest(`/v2/invite/project/link/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

import { iMemberInfoResponse } from "@crusher-shared/types/response/membersInfoResponse";

export const SET_TEAM_MEMBERS = "SET_TEAM_MEMBERS";

export const setTeamMembers = (members: iMemberInfoResponse[]) => ({
	type: SET_TEAM_MEMBERS,
	payload: { members },
});

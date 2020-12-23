import { TEAM_ROLE_TYPES } from '../db/teamRole';

export interface iMemberInfoResponse{
	id: number,
	name: string,
	email: string,
	role: TEAM_ROLE_TYPES,
	team_id: number
}

import { TEAM_ROLE_TYPES } from "../db/teamRole";
import { PROJECT_ROLE_TYPES } from "../db/projectRole";

export interface iMemberInfoResponse {
	id: number;
	name: string;
	email: string;
	role: TEAM_ROLE_TYPES | PROJECT_ROLE_TYPES;
	team_id: number;
}

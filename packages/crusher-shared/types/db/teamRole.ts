export enum TEAM_ROLE_TYPES{
	ADMIN = "ADMIN",
	MEMBER = "MEMBER"
}

export interface iTeamRole{
	user_id: number;
	team_id: number;
	role: TEAM_ROLE_TYPES;
	created_at: string;
	updated_at: string;
}


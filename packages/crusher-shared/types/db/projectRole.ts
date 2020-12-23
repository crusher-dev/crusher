export enum PROJECT_ROLE_TYPES{
	ADMIN = "ADMIN",
	REVIEWER = "REVIEWER",
	EDITOR = "EDITOR",
	VIEWER = "VIEWER"
}

export interface iProjectRole{
	user_id: number;
	project_id: number;
	role: PROJECT_ROLE_TYPES;
	created_at: string;
	updated_at: string;
};

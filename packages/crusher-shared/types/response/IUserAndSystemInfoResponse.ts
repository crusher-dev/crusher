export type ITeamAPIData = {
	id: number;
	name: string;
	meta: Record<string, any>;
	plan: "FREE" | "STARTER" | "PRO";
} | null;

export type TUserAPIData = {
	name: string;
	meta: Record<string, any>;
	avatar: string;
} | null;

export type TProjectsData = Array<{
	id: number;
	name: string;
	teamId: number;
	meta: Record<string, any>;
}> | null;

export type TSystemInfo = {
	OPEN_SOURCE?: {
		initialized: boolean;
	};
	REDIS_OPERATION: {
		working: boolean;
		message: string | null;
	};
	MYSQL_OPERATION: {
		working: boolean;
		message: string | null;
	};
	MONGO_DB_OPERATIONS: {
		working: boolean;
		message: string | null;
	};
} | null;

export type IUserAndSystemInfoResponse = {
	userId: number | null;
	isUserLoggedIn: boolean;
	userData: TUserAPIData;
	team: ITeamAPIData;
	projects: TProjectsData;
	system: TSystemInfo | null;
};

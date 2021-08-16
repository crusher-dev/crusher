export type ITeamAPIData = {
	id: number;
	name: string;
	meta?: any | null;
	plan: "FREE" | "STARTER" | "PRO";
} | null;

export type TUserAPIData = {
	name: string;
	avatar: string;
	lastVisitedURL: string | null;
	lastProjectSelectedId: number | null;
	meta?: any | null;
} | null;

export type TProjectsData = Array<{
	id: number;
	name: string;
	teamId: number;
	meta?: any | null;
}> | null;

export type TSystemInfo = {
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

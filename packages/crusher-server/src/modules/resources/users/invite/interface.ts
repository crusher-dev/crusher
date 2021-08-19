export enum InviteReferralEnum {
	PROJECT = "project",
	TEAM = "team",
}

export interface IInviteReferral {
	type: InviteReferralEnum;
	code: string;
}

export interface iProjectInviteReferral {
	_id: string;
	projectId: number;
	teamId: number;
	isPublic?: boolean;
	expiresOn?: Date;
	meta?: any;
}

export interface iTeamInviteReferral {
	_id: string;
	teamId: number;
	expiresOn?: Date;
	meta?: any;
}

export type ICreateTeamInviteCode = {
	teamId: number;
	expiresOn: Date | null;
	emails?: Array<string>;
	meta?: any;
};

export type ICreateProjectInviteCode = {
	teamId: number;
	projectId: number;
	expiresOn: Date | null;
	isPublic?: boolean;
	emails?: Array<string>;
	meta?: any;
};

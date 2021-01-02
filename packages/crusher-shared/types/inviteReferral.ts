export enum INVITE_REFERRAL_TYPES {
	PROJECT = 'project',
	TEAM = 'team'
};

export interface iInviteReferral{
	type: INVITE_REFERRAL_TYPES;
	code: string;
};

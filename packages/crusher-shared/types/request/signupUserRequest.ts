import { iInviteReferral } from '../inviteReferral';

export interface iSignupUserRequest{
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	inviteReferral?: iInviteReferral;
};

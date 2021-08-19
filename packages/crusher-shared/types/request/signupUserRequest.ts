import { iInviteReferral } from "../inviteReferral";

export interface iSignupUserRequest {
	name: string;
	email: string;
	password: string;
	inviteReferral?: iInviteReferral;
}

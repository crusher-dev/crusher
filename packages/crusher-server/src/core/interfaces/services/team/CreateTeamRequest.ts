export interface CreateTeamRequest {
	teamName: string;
	userId: number;
	stripeCustomerId?: string;
}

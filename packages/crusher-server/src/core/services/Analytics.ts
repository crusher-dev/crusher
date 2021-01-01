
/*
	Note - Never inject this as DI on global scope. It will have shared context.
 */
export default class AnalyticsService {
	private userId: string | null;
	private teamId: string | null;
	private projectId: string | null;

	constructor(userId: string | null, teamId: string | null, projectId: string | null) {
		if (!userId) console.warn("Tracking user with anonymous identity. Make sure to call addUser when user Sign in.");
		this.userId = userId;
		this.teamId = teamId;
		this.projectId = projectId;
	}

	trackPage() {}

	trackEvent() {}

	trackCustomEvent() {}

	addGroupId() {}

	addGroupTrait() {}

	addUserId() {}

	addUserTrait() {}
}

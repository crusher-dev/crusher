import Analytics = require("analytics-node");
const analytics = new Analytics("YmhV4TwBMwQ07rQdQPZVNnZLYmS4uNIf");
/*
	Note - Never inject this as DI on global scope. It will have shared context.
 */
export default class AnalyticsService {
	private userId: string | null;
	private teamId: string | null;
	private projectId: string | null;

	constructor(userId: string | null, teamId: string | null, projectId: string | null) {
		if (!userId) console.warn("Tracking user with anonymous identity. Make sure to call addUser when user sign in.");
		this.userId = userId;
		this.teamId = teamId;
		this.projectId = projectId;

		analytics.identify({ userId });
	}

	trackPage() {}

	trackEvent(value) {
		analytics.track({ userId: this.userId, ...value });
	}

	trackCustomEvent() {}

	addGroupId() {}

	addGroupTrait() {}

	addUserId() {}

	addUserTrait() {}
}

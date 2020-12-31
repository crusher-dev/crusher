import jsCookie from "js-cookie";

class AnalyticsService {
	private userId: string | null;
	private teamId: string | null;
	private projectId: string | null;

	constructor(
		userId: string | null,
		teamId: string | null,
		projectId: string | null,
	) {
		if (!userId)
			console.log(
				"Tracking user with anonymous identity. Make sure to call addUser when user Sign in.",
			);

		userId = window.analytics.identify();
		jsCookie.set("userId", userId);

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

/*
    Pass userId, teamId, projectId after reading from cookies
 */
export const initializeAnalytics = (
	userId: string | null,
	teamId: string | null,
	projectId: string | null,
) => {
	if (typeof window === "undefined") {
		console.log("Initialized at server leve");
		return;
	}
	// @ts-ignore
	Analytics = new AnalyticsService(userId, teamId, projectId);
};

export let Analytics = null;

export default Analytics;

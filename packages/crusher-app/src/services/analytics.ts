import {PAGE_TYPE} from "@constants/page";

class AnalyticsService {
	 intialize(
		userId: string | null,
		teamId: string | null,
		projectId: string | null,
	) {
		if (!userId)
			console.log(
				"Tracking user with anonymous identity. Make sure to call addUser when user Sign in.",
			);
	}

	 trackPage(pageType: PAGE_TYPE) {
		 window.analytics.page(pageType);
	}

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
export const ANALYTICS = Object.freeze(new AnalyticsService());

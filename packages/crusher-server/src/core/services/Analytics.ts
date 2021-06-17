/*
	Few rules for tracking
	1.) Don't use GA for tracking.
		- It's heavy
		- It collects lot of data.
	2.) Have an option to no track event if open source
	3.) Don't use any identifier in open source version.
 */
import Analytics from "analytics-node";
import { TSentryTracking } from "@crusher-shared/types/common/sentryTracking";

const analytics = new Analytics("YmhV4TwBMwQ07rQdQPZVNnZLYmS4uNIf");

/*
	Note - Never inject this as DI on global scope. It will have shared context.
 */

export default class SentryService implements TSentryTracking {
	private readonly userId: string | null;

	constructor(userId: string | null, teamId: string | null, projectId: string | null) {
		this.userId = userId;
		// If open source, get mac id
		analytics.identify({ userId });
	}

	trackPage() {}

	trackEvent() {
		// analytics.track({ userId: this.userId, ...value });
	}

	trackCustomEvent() {}

	addUserInfo() {}

	addGroupInfo() {}

	addUserToGroup() {}
}

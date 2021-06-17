// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { TSentryTracking } from "../../../crusher-shared/types/common/sentryTracking";

class SentryService implements TSentryTracking {
	// Lazy initialization
	intialize(userId: string | null) {
		if (!userId) console.log("Tracking user with anonymous identity. Make sure to call addUser when user Sign in.");
	}

	trackPage() {}

	trackEvent() {
		// analytics.track({ userId: this.userId, ...value });
	}

	trackCustomEvent() {}

	addUserInfo() {}

	addUserToGroup() {}

	addGroupInfo() {}
}

/*
		// We can also use static as only one instance is available
    Pass userId, teamId, projectId after reading from cookies
 */
export const ANALYTICS = Object.freeze(new SentryService());

import { NextRouter } from "next/router";
import { backendRequest } from "@utils/backendRequest";
import { USER_SYSTEM_API } from "@constants/api";
import { ROOT_PATH, ROUTES_ACCESSIBLE_WITHOUT_SESSION, ROUTES_TO_REDIRECT_WHEN_SESSION } from "@constants/page";
import { getEdition } from "@utils/helpers";
import { EDITION_TYPE } from "@crusher-shared/types/common/general";

export const handleOpenSourceMounting = async (router: NextRouter, loadCallback: any) => {
	const data = await backendRequest(USER_SYSTEM_API, {});
	const { user } = data;
	const { pathname } = router;

	if (getEdition() === EDITION_TYPE.OPEN_SOURCE) {
		if (Boolean(user.onboardingSteps.INITIAL_ONBOARDING) === false) {
			await router.push("/setup/onboarding");
		} else if (ROUTES_TO_REDIRECT_WHEN_SESSION.includes(pathname)) {
			await router.push("/app/dashboard");
		}

		loadCallback();
	}
};

/*
	Move to src_ee
 */
export const handleEERouting = async (router: NextRouter, loadCallback: any) => {
	const data = await backendRequest(USER_SYSTEM_API, {});
	const { userId, user } = data;
	const { pathname } = router;
	const loggedIn = !!userId;

	if (loggedIn) {
		if (user.onboardingSteps.INITIAL_ONBOARDING === "false") {
			await router.push("/setup/onboarding");
		} else if (ROUTES_TO_REDIRECT_WHEN_SESSION.includes(pathname)) {
			await router.push("/app/dashboard");
		}
	} else {
		if (!ROUTES_ACCESSIBLE_WITHOUT_SESSION.includes(pathname) || pathname === ROOT_PATH) {
			await router.push("/login");
			return;
		}
	}

	if (loadCallback) {
		loadCallback();
	}
};

export const redirectUserOnMount = async (router: NextRouter, loadCallback: any) => {
	if (getEdition() === EDITION_TYPE.OPEN_SOURCE) {
		handleOpenSourceMounting(router, loadCallback);
	} else {
		handleEERouting(router, loadCallback);
	}
};

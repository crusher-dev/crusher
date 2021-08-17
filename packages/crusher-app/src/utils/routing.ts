import { NextRouter } from "next/router";
import { ROOT_PATH, ROUTES_ACCESSIBLE_WITHOUT_SESSION, ROUTES_TO_REDIRECT_WHEN_SESSION } from "@constants/page";
import { getEdition } from "@utils/helpers";
import { EditionTypeEnum } from "@crusher-shared/types/common/general";
import { IUserAndSystemInfoResponse } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";
import { isTempTestPending } from "@utils/user";
import { getBoolean } from '@utils/common';

export const handleOpenSourceMounting = async (data: IUserAndSystemInfoResponse, router: NextRouter, loadCallback: any) => {
	const { userData: user } = data;
	const { pathname } = router;

	if (getEdition() === EditionTypeEnum.OPEN_SOURCE) {

		if (getBoolean(user.meta.INITIAL_ONBOARDING )!== true) {
			await router.push("/setup/onboarding");
		} else if (ROUTES_TO_REDIRECT_WHEN_SESSION.includes(pathname)) {
			if (isTempTestPending()) {
				await router.push("/app/tests");
			} else {
				await router.push("/app/dashboard");
			}
		}

		loadCallback();
	}
};

/*
	Move to src_ee
 */
export const handleEERouting = async (data: IUserAndSystemInfoResponse, router: NextRouter, loadCallback: any) => {
	const { userData: user, isUserLoggedIn } = data;
	const { pathname } = router;

	if (isUserLoggedIn) {
		if (getBoolean(user.meta.INITIAL_ONBOARDING) !== true) {
			await router.push("/setup/onboarding");
		} else if (ROUTES_TO_REDIRECT_WHEN_SESSION.includes(pathname)) {
			if (isTempTestPending()) {
				await router.push("/app/tests");
			} else {
				await router.push("/app/dashboard");
			}
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

/*
	@Note :-
	Can remove passing router as dependency. More clean and easier to create test.
	loadCallback, router dependecy can be removed.
 */
export const redirectUserOnMount = async (data: IUserAndSystemInfoResponse, router: NextRouter, loadCallback: any) => {
	if (getEdition() === EditionTypeEnum.OPEN_SOURCE) {
		await handleOpenSourceMounting(data, router, loadCallback);
	} else {
		await handleEERouting(data, router, loadCallback);
	}
};

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";

import { USER_SYSTEM_API } from "@constants/api";
import { IUserAndSystemInfoResponse } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";
import { cliLoginUserKeyAtom } from "@store/atoms/global/cliToken";
import { updateInitialDataMutator } from "@store/mutators/user";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";
import { resolvePathToBackendURI, resolvePathToFrontendURI } from "@utils/common/url";
import { redirectUserOnMount } from "@utils/routing";

/*
	Two scenarios to check for
	- When data is loaded on Mount and passed externally
	- How redirection is working

	Later :- Can add function to fetchData. Instead of direct use effect
 */
export function loadUserDataAndRedirect({ fetchData = true, userAndSystemData = null }) {
	const router = useRouter();

	const [, updateInitialData] = useAtom(updateInitialDataMutator);

	const [dataLoaded, setDataLoaded] = useState(false);
	const [loginKey, setLoginKey] = useAtom(cliLoginUserKeyAtom);


	useEffect(() => {

		(async () => {
			let dataToConsider: IUserAndSystemInfoResponse | null = null;
			if (fetchData) {
				dataToConsider = await backendRequest(USER_SYSTEM_API, {});
			} else {
				if (userAndSystemData === null) return;
				dataToConsider = userAndSystemData;
			}
			updateInitialData(dataToConsider);

			if (loginKey && loginKey !== "null" && dataToConsider.isUserLoggedIn) {
				backendRequest(resolvePathToBackendURI("/cli/actions/login.user"), { method: RequestMethod.POST, payload: { loginKey } })
					.then(() => {
						setLoginKey(null);
						window.location.href = "/login_sucessful";
					})
					.catch((err) => {
						if (err.message.includes("Invalid login key")) {
							setLoginKey(null);
							redirectUserOnMount(dataToConsider, router, setDataLoaded.bind(this, true));
						}
					});
			} else {
				await redirectUserOnMount(dataToConsider, router, setDataLoaded.bind(this, true));
			}
		})();
	}, [userAndSystemData]);

	return [dataLoaded];
}

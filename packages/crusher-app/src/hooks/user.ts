import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";

import { USER_SYSTEM_API } from "@constants/api";
import { IUserAndSystemInfoResponse } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";
import { backendRequest } from "@utils/common/backendRequest";
import { redirectUserOnMount } from "@utils/routing";

import { selectInitialProjectMutator, updateInitialDataMutator } from "@store/mutators/user";

/*
	Two scenarios to check for
	- When data is loaded on Mount and passed externally
	- How redirection is working

	Later :- Can add function to fetchData. Instead of direct use effect
 */
export function loadUserDataAndRedirect({ fetchData = true, userAndSystemData = null }) {
	const router = useRouter();
	const [, updateInitialData] = useAtom(updateInitialDataMutator);
	const [, selectInitialProject] = useAtom(selectInitialProjectMutator);

	const [dataLoaded, setDataLoaded] = useState(false);

	useEffect(() => {
		(async () => {
			let dataToConsider: IUserAndSystemInfoResponse | null = null;
			if (fetchData) {
				dataToConsider = await backendRequest(USER_SYSTEM_API, {});
			} else {
				if (userAndSystemData === null) return;
				dataToConsider = userAndSystemData;
			}

			console.log(dataToConsider);
			updateInitialData(dataToConsider);
			selectInitialProject(dataToConsider);

			await redirectUserOnMount(dataToConsider, router, setDataLoaded.bind(this, true));
		})();
	}, [userAndSystemData]);

	return [dataLoaded];
}

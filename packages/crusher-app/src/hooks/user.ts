import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useAtom } from "jotai";

import { USER_SYSTEM_API } from "@constants/api";
import { IUserAndSystemInfoResponse } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";
import { backendRequest } from "@utils/common/backendRequest";
import { redirectUserOnMount } from "@utils/routing";

import { appStateItemMutator } from "../store/atoms/global/appState";
import { projectsAtom } from "../store/atoms/global/project";
import { systemConfigAtom } from "../store/atoms/global/systemConfig";
import { teamAtom } from "../store/atoms/global/team";
import { userAtom } from "../store/atoms/global/user";
import { USER_META_KEYS } from '@constants/USER';

/*
	Two scenarios to check for
	- When data is loaded on Mount and passed externally
	- How redirection is working
 */
export function loadUserDataAndRedirect({ fetchData = true, userAndSystemData = null }) {
	const router = useRouter();

	const [, setUser] = useAtom(userAtom);
	const [, setSystem] = useAtom(systemConfigAtom);
	const [, setTeam] = useAtom(teamAtom);
	const [, setProjects] = useAtom(projectsAtom);
	const [, setAppStateItem] = useAtom(appStateItemMutator);

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

			const { userData, team, system, projects } = dataToConsider;
			setUser(userData);
			setTeam(team);
			setSystem(system);
			setProjects(projects);

			const selectedProjectId = userData?.meta?.[USER_META_KEYS.SELECTED_PROJECT_ID] ?? projects[0].id ;
			setAppStateItem({ key: "selectedProjectId", value: selectedProjectId  });

			await redirectUserOnMount(dataToConsider, router, setDataLoaded.bind(this, true));
			setDataLoaded(true);
		})();
	}, [userAndSystemData]);

	return [dataLoaded];
}

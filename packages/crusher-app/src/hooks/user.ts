import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../store/atoms/global/user";
import { systemConfigAtom } from "../store/atoms/global/systemConfig";
import { teamAtom } from "../store/atoms/global/team";
import { appStateAtom, appStateItemMutator } from "../store/atoms/global/appState";
import { projectsAtom } from "../store/atoms/global/project";
import { IUserAndSystemInfoResponse } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";
import { backendRequest } from "@utils/backendRequest";
import { USER_SYSTEM_API } from "@constants/api";
import { redirectUserOnMount } from "@utils/routing";

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
	const [appState] = useAtom(appStateAtom);
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
			if (!appState.selectedProjectId) {
				setAppStateItem({ key: "selectedProjectId", value: projects && projects[0].id });
			}
			await redirectUserOnMount(dataToConsider, router, setDataLoaded.bind(this, true));

			setDataLoaded(true);
		})();
	}, [userAndSystemData]);

	return [dataLoaded];
}

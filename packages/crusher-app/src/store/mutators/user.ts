import { atom } from "jotai";

import { projectsAtom } from "@store/atoms/global/project";
import { systemConfigAtom } from "@store/atoms/global/systemConfig";
import { teamAtom } from "@store/atoms/global/team";
import { userAtom } from "@store/atoms/global/user";
import { Analytics } from "@utils/core/analytics";

interface UserInitialData {
	userData: any;
	team: any;
	system: any;
	projects: any;
}

export const updateInitialDataMutator = atom(null, (_get, _set, data: UserInitialData) => {
	_set(userAtom, data.userData);
	_set(teamAtom, data.team);
	_set(systemConfigAtom, data.system);
	_set(projectsAtom, data.projects);

	if (data.userData) {
		Analytics.identify(
			data.userData.name,
			data.userData.userId,
			data.userData.email,
			data.team.id,
			data.team.plan,
			"false",
			process.env.NEXT_PUBLIC_CRUSHER_MODE,
		);
	}
});
import { atom } from "jotai";
import { userAtom } from "@store/atoms/global/user";
import { teamAtom } from "@store/atoms/global/team";
import { systemConfigAtom } from "@store/atoms/global/systemConfig";
import { projectsAtom } from "@store/atoms/global/project";
import { USER_META_KEYS } from "@constants/USER";
import { appStateAtom, appStateItemMutator } from "@store/atoms/global/appState";
import { Analytics } from "@utils/core/analytics";
import { tempProjectAtom } from "@store/atoms/global/temp/tempTestId";

interface UserInitialData {
	userData: any;
	team: any;
	system: any;
	projects: any;
}

/**
 * EE
 */
export const updateInitialDataMutator = atom(null, (_get, _set, data: UserInitialData) => {
	_set(userAtom, data.userData);
	_set(teamAtom, data.team);
	_set(systemConfigAtom, data.system);
	_set(projectsAtom, data.projects);

	if (!!data.userData) {
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

export const selectInitialProjectMutator = atom(null, (_get, _set, data: UserInitialData) => {
	const { userData, projects } = data;
	const tempProjectToRedirect = _get(tempProjectAtom);
	const selectedProjectId = !!tempProjectToRedirect ? tempProjectToRedirect : userData?.meta?.[USER_META_KEYS.SELECTED_PROJECT_ID] ?? (projects?.[0] ? projects?.[0].id : null);

	_set(tempProjectAtom, "");
	_set(appStateItemMutator, { key: "selectedProjectId", value: selectedProjectId });
});

import { atom } from "jotai";

import { appStateAtom } from "./appState";
import { projectsAtom } from "./project";
import { systemConfigAtom } from "./systemConfig";
import { teamAtom } from "./team";
import { userAtom } from "./user";

/*
	Combine different atom and user
*/
export const rootGlobalAtom = atom((get) => ({
	appState: get(appStateAtom),
	systemConfig: get(systemConfigAtom),
	projects: get(projectsAtom),
	teamAtom: get(teamAtom),
	user: get(userAtom),
}));

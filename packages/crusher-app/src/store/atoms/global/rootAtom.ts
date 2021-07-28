import { atom } from "jotai";
import { appStateAtom } from "./appState";
import { systemConfigAtom } from "./systemConfig";
import { userAtom } from "./user";
import { projectsAtom } from "./project";
import { teamAtom } from "./team";

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

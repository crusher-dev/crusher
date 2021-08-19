import { atomWithImmer } from "jotai/immer";
import { atom } from "jotai";
import { appStateAtom } from "./appState";
import { TProjectsData } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";

export const projectsAtom = atomWithImmer<TProjectsData>(null);
projectsAtom.debugLabel = "projectsAtom";

/*
	Mutator and selector for these atom
 */
export const currentProject = atom((get) => {
	const { selectedProjectId } = get(appStateAtom);
	const projects = get(projectsAtom);
	if (projects === null) return null;
	return projects?.filter(({ id }) => selectedProjectId === id)[0];
});

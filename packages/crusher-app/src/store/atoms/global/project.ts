import produce from "immer";
import { atom } from "jotai";
import { atomWithImmer } from "jotai/immer";

import { TProjectsData } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";

import { appStateAtom } from "./appState";

export const projectsAtom = atomWithImmer<TProjectsData[] | null>(null);
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

/*
	Use to add project instantly.
 */
export const updateCurrentProjectInfoAtom = atom(null, (get, set, update) => {
	const { selectedProjectId } = get(appStateAtom);
	const projectList = get(projectsAtom);
	const projects = produce(projectList, (draftProjects) => {
		for (const id in draftProjects) {
			if (draftProjects[id].id === selectedProjectId) {
				draftProjects[id] = update;
			}
		}
	});

	set(projectsAtom, projects);
});

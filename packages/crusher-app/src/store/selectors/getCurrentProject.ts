import { atom } from "jotai";

import { appStateAtom } from "../atoms/global/appState";
import { projectsAtom } from "../atoms/global/project";

export const currentProjectSelector = atom((get) => {
	const { selectedProjectId } = get(appStateAtom);
	const projects = get(projectsAtom);
	return projects.filter(({ id }) => selectedProjectId === id)[0];
});

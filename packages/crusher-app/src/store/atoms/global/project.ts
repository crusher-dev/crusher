import { atomWithImmer } from 'jotai/immer';
import { atom } from 'jotai';
import { appStateAtom } from './appState';

export const projectsAtom = atomWithImmer([]);
projectsAtom.debugLabel = "projectsAtom";

/*
	Mutator and selector for these atom
 */
export const currentProject = atom((get) => {
	const { selectedProjectId } = get(appStateAtom);
	const projects = get(projectsAtom);
	return projects.filter(({ id }) => selectedProjectId === id)[0];
});

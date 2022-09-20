import produce from "immer";
import { atom } from "jotai";
import { atomWithImmer } from "jotai/immer";

type TAppState = {
	currentURL: string;
	lastPing: number;
	selectedProjectId: number | null;
	appDataLoaded?: boolean;
};

// @ts-ignore
const initialAppStage = { currentURL: "", lastPing: Date.now(), selectedProjectId: null };
export const appStateAtom = atomWithImmer<TAppState>(initialAppStage);
appStateAtom.debugLabel = "app.appState";

/*
	Mutator and selector for these atom
 */
export const appStateItemMutator = atom(null, (get, set, { key, value }) => {
	const appState = get(appStateAtom);

	const newState = produce(appState, (newState) => {
		// @ts-ignore
		newState[key] = value;
	});
	set(appStateAtom, newState);
});

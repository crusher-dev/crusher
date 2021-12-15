import produce from "immer";
import { atom } from "jotai";
import { atomWithImmer } from "jotai/immer";

type TAppState = {
	showShouldOnboardingOverlay: boolean
};

// @ts-ignore
const initialAppStage = { showShouldOnboardingOverlay: true };
const appStateAtom = atomWithImmer<TAppState>(initialAppStage);
appStateAtom.debugLabel = "appState";

/*
	Mutator and selector for these atom
 */
const appStateItemMutator = atom(null, (get, set, { key, value }) => {
	const appState = get(appStateAtom);
	const newState = produce(appState, (newState) => {
		// @ts-ignore
		newState[key] = value;
	});
	set(appStateAtom, newState);
});

export { appStateAtom, appStateItemMutator }
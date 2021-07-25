import { atomWithImmer } from "jotai/immer";
import { atom } from 'jotai';
import produce from 'immer';

type TAppState = {
	currentURL: string;
	lastPing: number;
	selectedProjectId: number | null;
	appDataLoaded?: boolean;
};

const initialAppStage = { currentURL: "", lastPing: Date.now(), selectedProjectId: null };
export const appStateAtom = atomWithImmer<TAppState>(initialAppStage);
appStateAtom.debugLabel = "appState";

/*
	Mutator and selector for these atom
 */
export const appStateItemMutator = atom(null, (get, set, {key, value})=>{
	const appState = get(appStateAtom);
	const newState = produce(appState, (newState) => {
		newState[key] = value;
	});
	set(appStateAtom, newState);
});

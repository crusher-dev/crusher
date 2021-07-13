import { atomWithImmer } from "jotai/immer";

type TAppState = {
	currentURL: string;
	lastPing: number;
	version?: string;
};

const initialAppStage = { currentURL: "", lastPing: Date.now() };

export const appStateAtom = atomWithImmer<TAppState>(initialAppStage);
appStateAtom.debugLabel = "appState";

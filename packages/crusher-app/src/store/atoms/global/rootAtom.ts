import { atom } from "jotai";
import { appStateAtom } from "./appState";
import { configAtom } from "./config";
import { userAtom } from "./user";

const rootGlobalAtom = atom((get) => ({
	appStateAtom: get(appStateAtom),
	configAtom: get(configAtom),
	userAtom: get(userAtom),
}));

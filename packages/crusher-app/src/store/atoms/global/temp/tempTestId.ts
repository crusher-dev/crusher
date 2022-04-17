import { atom } from "jotai";

const primitiveTempTestAtom = atom<string | null>(typeof window !== "undefined" ? localStorage.getItem("tempTest") ?? null : null);

export const tempTestAtom = atom(
	(get) => get(primitiveTempTestAtom),
	(_get, set, newValue: any) => {
		set(primitiveTempTestAtom, newValue);
		window.localStorage.setItem("tempTest", newValue);
	},
);

const baseTempProjectAtom = atom<string | null>(typeof window !== "undefined" ? localStorage.getItem("tempProjectId") ?? null : null);

export const tempProjectAtom = atom(
	(get) => get(baseTempProjectAtom),
	(_get, set, newValue: any) => {
		set(baseTempProjectAtom, newValue);
		window.localStorage.setItem("tempProjectId", newValue);
	},
);

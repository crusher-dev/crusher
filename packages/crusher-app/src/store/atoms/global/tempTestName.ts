import { atom } from "jotai";

const primitiveTempTestAtom = atom<string | null>(typeof window !== "undefined" ? localStorage.getItem("tempTestName") ?? null : null);

export const tempTestNameAtom = atom(
	(get) => get(primitiveTempTestAtom),
	(_get, set, newValue: any) => {
		set(primitiveTempTestAtom, newValue);
		window.localStorage.setItem("tempTestName", newValue);
	},
);

import { atom } from "jotai";

const primitiveTempTestAtom = atom<string | null>(typeof window !== "undefined" ? localStorage.getItem("tempTest") ?? null : null);

export const tempTestAtom = atom(
	(get) => get(primitiveTempTestAtom),
	(_get, set, newValue: any) => {
		set(primitiveTempTestAtom, newValue);
		window.localStorage.setItem("tempTest", newValue);
	},
);

import { atom } from "jotai";

const primitiveTempTestUpdateIdAtom = atom<string | null>(typeof window !== "undefined" ? localStorage.getItem("tempTestUpdateId") ?? null : null);

export const tempTestUpdateIdAtom = atom(
	(get) => get(primitiveTempTestUpdateIdAtom),
	(_get, set, newValue: any) => {
		set(primitiveTempTestUpdateIdAtom, newValue);
		window.localStorage.setItem("tempTestUpdateId", newValue);
	},
);

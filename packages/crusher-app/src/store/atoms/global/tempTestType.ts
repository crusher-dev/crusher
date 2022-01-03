import { atom } from "jotai";

const primitiveTempTestTypeAtom = atom<string | null>(typeof window !== "undefined" ? localStorage.getItem("tempTestType") ?? null : null);

export const tempTestTypeAtom = atom(
	(get) => get(primitiveTempTestTypeAtom),
	(_get, set, newValue: any) => {
		set(primitiveTempTestTypeAtom, newValue);
		window.localStorage.setItem("tempTestType", newValue);
	},
);

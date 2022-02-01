import { atom } from "jotai";

const primitiveCliLoginUserKeyAtom = atom<string | null>(typeof window !== "undefined" ? localStorage.getItem("cliUserLoginKey") ?? null : null);

export const cliLoginUserKeyAtom = atom(
	(get) => get(primitiveCliLoginUserKeyAtom),
	(_get, set, newValue: any) => {
		set(primitiveCliLoginUserKeyAtom, newValue);
		window.localStorage.setItem("cliUserLoginKey", newValue);
	},
);

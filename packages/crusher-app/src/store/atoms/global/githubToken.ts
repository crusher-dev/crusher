import { atom } from "jotai";

const primitiveGithubTokenAtom = atom<string | null>(typeof window !== "undefined" ? localStorage.getItem("githubToken") ?? null : null);

export const githubTokenAtom = atom(
	(get) => get(primitiveGithubTokenAtom),
	(_get, set, newValue: any) => {
		set(primitiveGithubTokenAtom, newValue);
		window.localStorage.setItem("githubToken", newValue);
	},
);

import { atom } from "jotai";

const LOCAL_STORAGE_KEY = "inviteCodeUserKeyAtom";
const primitiveInviteCodeUserKeyAtom = atom<string | null>(typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) ?? null : null);

export const inviteCodeUserKeyAtom = atom(
	(get) => get(primitiveInviteCodeUserKeyAtom),
	(_get, set, newValue: any) => {
		set(primitiveInviteCodeUserKeyAtom, newValue);
		if(newValue == null) {
			window.localStorage.removeItem(LOCAL_STORAGE_KEY);
		}
		window.localStorage.setItem(LOCAL_STORAGE_KEY, newValue);
	},
);

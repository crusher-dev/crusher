import { atom } from "jotai";

export const selectedTestAtom = atom<number>(0);
export const testCardConfigAtom = atom(null);
export const selectedTabAtom = atom(1);

export const activeActionIndexAtom = atom<number>(0);

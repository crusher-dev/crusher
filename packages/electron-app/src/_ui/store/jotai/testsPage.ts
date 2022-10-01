import { atom } from "jotai";

export const editInputAtom = atom<any | null>(null);

export const isStepHoverAtom = atom<boolean>(false);
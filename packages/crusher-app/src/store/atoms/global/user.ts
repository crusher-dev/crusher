import { atomWithImmer } from "jotai/immer";

const initialUserValue = {};

export const userAtom = atomWithImmer(initialUserValue);
userAtom.debugLabel = "userAtom";

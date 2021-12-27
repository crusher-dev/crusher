import { atom } from "jotai";
import { atomWithImmer } from "jotai/immer";

type TRecorderState = {
	targetSiteUrl: null,
    device: null
};

// @ts-ignore
const initialRecorderState = { targetSiteUrl: null, device: null };
const appStateAtom = atomWithImmer<TRecorderState>(initialRecorderState);
appStateAtom.debugLabel = "recorderState";


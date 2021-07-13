import { atomWithImmer } from "jotai/immer";

type TConfig = {
	isBackendWorking: boolean;
};

const initialConfig = { isBackendWorking: false };

export const configAtom = atomWithImmer<TConfig>(initialConfig);
configAtom.debugLabel = "configAtom";

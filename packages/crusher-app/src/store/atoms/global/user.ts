import { atomWithImmer } from "jotai/immer";

type TProject = {
	id: string;
	name: string;
};

type TUser = {
	id?: string;
	projectId?: string;
	fullName?: string;
	projects?: TProject[];
};

const initialUserValue = {};

export const userAtom = atomWithImmer<TUser>(initialUserValue);
userAtom.debugLabel = "userAtom";

import { atomWithImmer } from "jotai/immer";
import { TUserAPIData } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";

export const userAtom = atomWithImmer<TUserAPIData>(null);
userAtom.debugLabel = "userAtom";

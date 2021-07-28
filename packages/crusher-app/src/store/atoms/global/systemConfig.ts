import { atomWithImmer } from "jotai/immer";

import { TSystemInfo } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";

const initialValue: TSystemInfo = null;

export const systemConfigAtom = atomWithImmer<TSystemInfo>(initialValue);
systemConfigAtom.debugLabel = "systemConfigAtom";

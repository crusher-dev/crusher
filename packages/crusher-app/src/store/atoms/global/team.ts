import { atomWithImmer } from "jotai/immer";

import { ITeamAPIData } from "@crusher-shared/types/response/IUserAndSystemInfoResponse";

// type TApiTeamData = Pick<IUserAndSystemInfoResponse, "team">;
export const teamAtom = atomWithImmer<ITeamAPIData>(null);

teamAtom.debugLabel = "teamState";

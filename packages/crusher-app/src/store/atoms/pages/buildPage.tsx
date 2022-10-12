import { atomWithQuery } from "../../utils";

const keys = ["search", "status", "triggeredBy", "page", "showMine", "showLocal"];
export const buildFiltersAtom = atomWithQuery(keys, []);

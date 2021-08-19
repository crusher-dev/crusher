import { atomWithQuery } from "../../utils";

const keys = ["search", "status", "triggeredBy", "page"];
export const buildFiltersAtom = atomWithQuery(keys, []);

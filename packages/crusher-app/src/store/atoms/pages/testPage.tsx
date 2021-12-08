import { atomWithQuery } from "../../utils";

const keys = ["search", "status", "page"];
export const testFiltersAtom = atomWithQuery(keys, []);

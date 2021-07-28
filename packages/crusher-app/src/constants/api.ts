import { resolvePathToBackendURI } from '@utils/url';

const currentlyLoggedIn = true;

// System Var
export const loggedIn = "http://localhost:8000/user/getUserAndSystemInfo";
export const loggedOff = "https://api.jsonbin.io/b/60f5e29da263d14a2977d6d7/3";

export const USER_SYSTEM_API = resolvePathToBackendURI("/user/getUserAndSystemInfo");
export const TEST_LIST_API = "https://api.jsonbin.io/b/60fde751a917050205d03811/4";
export const BUILD_LIST_API = "https://api.jsonbin.io/b/60fe0488a917050205d0428b/1";

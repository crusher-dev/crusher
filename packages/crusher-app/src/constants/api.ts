import { resolvePathToBackendURI } from "@utils/url";
export const USER_SYSTEM_API = resolvePathToBackendURI("/user/getUserAndSystemInfo");
export const getTestListAPI = (projectId: string) => resolvePathToBackendURI(`/projects/${projectId}/tests`);
export const getBuildsList = (projectId: string) => resolvePathToBackendURI(`/projects/${projectId}/builds`);
export const getBuildReportAPI = (buildId: string) => resolvePathToBackendURI(`/builds/${buildId}/reports`);
export const RELEASE_API = resolvePathToBackendURI("/release/info");

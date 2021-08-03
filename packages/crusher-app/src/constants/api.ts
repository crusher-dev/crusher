import { resolvePathToBackendURI } from "@utils/url";
export const USER_SYSTEM_API = resolvePathToBackendURI("/user/getUserAndSystemInfo");
export const getTestListAPI = (projectId: number, fetchTestAfterSaving: boolean) =>
	resolvePathToBackendURI(`/projects/${projectId}/tests?fetchTestAfterSaving=${fetchTestAfterSaving}`);
export const getBuildsList = (projectId: string) => resolvePathToBackendURI(`/projects/${projectId}/builds`);
export const getBuildReportAPI = (buildId: string) => resolvePathToBackendURI(`/builds/${buildId}/reports`);
export const RELEASE_API = resolvePathToBackendURI("/release/info");

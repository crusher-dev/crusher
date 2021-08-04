import { resolvePathToBackendURI } from "@utils/url";
export const USER_SYSTEM_API = resolvePathToBackendURI("/user/getUserAndSystemInfo");
export const getTestListAPI = (projectId: number, fetchTestAfterSaving: boolean) =>
	resolvePathToBackendURI(`/projects/${projectId}/tests?fetchTestAfterSaving=${fetchTestAfterSaving}`);
export const getBuildsList = (projectId: string,monitoring:string) => resolvePathToBackendURI(`/projects/${projectId}/builds?monitoring=${monitoring}`);
export const getRunTestApi = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/tests/actions/run`);
export const getBuildReportAPI = (buildId: string) => resolvePathToBackendURI(`/builds/${buildId}/reports`);
export const RELEASE_API = resolvePathToBackendURI("/release/info");

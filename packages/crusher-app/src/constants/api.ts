import { resolvePathToBackendURI } from "@utils/url";
export const USER_SYSTEM_API = resolvePathToBackendURI("/user/getUserAndSystemInfo");
export const getTestListAPI = (projectId:string) => resolvePathToBackendURI(`/tests/list?project_id=${projectId}`);
export const getBuildsList = (projectId:string) => resolvePathToBackendURI(`/projects/${projectId}/builds`);
export const getBuildReportAPI = (buildId:string) => resolvePathToBackendURI(`/builds/${buildId}/reports/`);

import { resolvePathToBackendURI } from "@utils/url";
export const USER_SYSTEM_API = resolvePathToBackendURI("/user/getUserAndSystemInfo");
export const getTestListAPI = (projectId) => resolvePathToBackendURI(`/tests/list?project_id=${projectId}`);
export const getBuildsList = (projectId) => resolvePathToBackendURI(`/projects/${projectId}/builds`);
export const BUILD_LIST_API = "https://api.jsonbin.io/b/60fe0488a917050205d0428b/1";
export const getBuildReportAPI = (buildId) => resolvePathToBackendURI(`/builds/${buildId}/reports/`);

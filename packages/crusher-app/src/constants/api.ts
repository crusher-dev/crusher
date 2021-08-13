import { BuildTriggerEnum } from "@crusher-shared/types/response/iProjectBuildListResponse";
import { resolvePathToBackendURI } from "@utils/url";

export const USER_SYSTEM_API = resolvePathToBackendURI("/users/actions/getUserAndSystemInfo");
export const getTestListAPI = (projectId: number, fetchTestAfterSaving: boolean) =>
	resolvePathToBackendURI(`/projects/${projectId}/tests?fetchTestAfterSaving=${fetchTestAfterSaving}`);
export const getBuildsList = (projectId: string, triggerType: BuildTriggerEnum) =>
	resolvePathToBackendURI(`/projects/${projectId}/builds?trigger=${triggerType}`);
export const getRunTestApi = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/tests/actions/run`);
export const getBuildReportAPI = (buildId: string) => resolvePathToBackendURI(`/builds/${buildId}/reports`);
export const RELEASE_API = resolvePathToBackendURI("/release/info");

export const getInviteMemberAPI = (projectId: number) => resolvePathToBackendURI(`/users/invite.link?projectId=${projectId}`);
export const deleteTestApi = (testId: number)=> resolvePathToBackendURI(`/tests/${testId}/actions/delete`);
export const changeTestInfoAPI = (testId: number)=> resolvePathToBackendURI(`/tests/${testId}/actions/edit`);
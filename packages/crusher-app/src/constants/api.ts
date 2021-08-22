import identity from "lodash/identity";
import pickBy from "lodash/pickBy";

import { BuildTriggerEnum } from "@crusher-shared/types/response/iProjectBuildListResponse";
import { resolvePathToBackendURI } from "@utils/url";

export const USER_SYSTEM_API = resolvePathToBackendURI("/users/actions/getUserAndSystemInfo");
export const getTestListAPI = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/tests`);
export const getBuildsList = (projectId: string, triggerType: BuildTriggerEnum, otherFilters = {}) => {
	const filteredObj = pickBy(otherFilters, identity);
	const urlParams = new URLSearchParams(filteredObj);
	const urlParamString = urlParams.toString();

	return resolvePathToBackendURI(`/projects/${projectId}/builds?${triggerType ? `trigger=${triggerType}` : ""}${urlParamString}`);
};

export const getRunTestApi = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/tests/actions/run`);
export const getBuildReportAPI = (buildId: string) => resolvePathToBackendURI(`/builds/${buildId}/reports`);
export const RELEASE_API = resolvePathToBackendURI("/release/info");

export const getInviteMemberAPI = (projectId: number) => resolvePathToBackendURI(`/users/invite.link?projectId=${projectId}`);
export const deleteTestApi = (testId: number) => resolvePathToBackendURI(`/tests/${testId}/actions/delete`);
export const changeTestInfoAPI = (testId: number) => resolvePathToBackendURI(`/tests/${testId}/actions/edit`);

export const updateProjectAPI = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/actions/update.meta`);
export const updateUserMetaAPI = () => resolvePathToBackendURI(`/users/actions/update.meta`);
export const updateTeamMetaAPI = () => resolvePathToBackendURI(`teams/actions/update.meta`);

import pickBy from "lodash/pickBy";

import { BuildTriggerEnum } from "@crusher-shared/types/response/iProjectBuildListResponse";
import { resolvePathToBackendURI } from "@utils/common/url";

export const USER_SYSTEM_API = resolvePathToBackendURI("/users/actions/getUserAndSystemInfo");
export const getTestListAPI = (projectId: number, otherFilters: any = {}) => {
	if (!otherFilters.page) {
		otherFilters.page = 0;
	}

	const filteredObj = pickBy(otherFilters, (v) => v !== null && v !== undefined);
	const urlParams = new URLSearchParams(filteredObj);
	const urlParamString = urlParams.toString();

	return resolvePathToBackendURI(`/projects/${projectId}/tests?${urlParamString}`);
};

export const getTestsAPI = (otherFilters: any = {}) => {
	if (!otherFilters.page) {
		otherFilters.page = 0;
	}

	const filteredObj = pickBy(otherFilters, (v) => v !== null && v !== undefined);
	const urlParams = new URLSearchParams(filteredObj);
	const urlParamString = urlParams.toString();

	return resolvePathToBackendURI(`/tests?${urlParamString}`);
};

export const getBuildsList = (projectId: string, triggerType: BuildTriggerEnum, otherFilters = {}) => {
	const filteredObj = pickBy(otherFilters, (v) => v !== null && v !== undefined);
	const urlParams = new URLSearchParams(filteredObj);
	const urlParamString = urlParams.toString();

	return resolvePathToBackendURI(`/projects/${projectId}/builds?${urlParamString}${triggerType ? `&triggerType=${triggerType}` : ""}`);
};

export const getRunTestApi = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/tests/actions/run`);
export const getLocalBuidlReportApi = (id: string) => resolvePathToBackendURI(`/projects/22/builds/actions/get.local?localBuildKey=${id}`);
export const getBuildReportAPI = (buildId: string) => resolvePathToBackendURI(`/builds/${buildId}/report`);
export const RELEASE_API = resolvePathToBackendURI("/release/info");

export const getInviteMemberAPI = (projectId: number) => resolvePathToBackendURI(`/users/invite.link?projectId=${projectId}`);
export const deleteTestApi = (testId: number) => resolvePathToBackendURI(`/tests/${testId}/actions/delete`);
export const changeTestInfoAPI = (testId: number) => resolvePathToBackendURI(`/tests/${testId}/actions/edit`);

export const updateProjectAPI = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/actions/update.meta`);
export const updateUserMetaAPI = () => resolvePathToBackendURI(`/users/actions/update.meta`);
export const updateTeamMetaAPI = () => resolvePathToBackendURI(`/teams/actions/update.meta`);

export const getProjectEnvironments = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/environments`);
export const getProjectMonitoring = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/monitorings`);

export const createProjectMonitoring = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/monitorings/actions/create`);
export const updateProjectMonitoing = (projectId: number, monitoringId: number) =>
	resolvePathToBackendURI(`/projects/${projectId}/monitorings/${monitoringId}/actions/update`);
export const deleteProjectMonitoring = (projectId: number, monitoringId: number) =>
	resolvePathToBackendURI(`/projects/${projectId}/monitorings/${monitoringId}/actions/delete`);

export const createProjectEnvironment = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/environments/actions/create`);
export const updateProjectEnv = (projectId: number, envId: number) => resolvePathToBackendURI(`/projects/${projectId}/environments/${envId}/actions/update`);
export const deleteProjectEnv = (projectId: number, envId: number) => resolvePathToBackendURI(`/projects/${projectId}/environments/${envId}/actions/delete`);

export const addGithubRepo = (projectId: number) => resolvePathToBackendURI(`/integrations/${projectId}/github/actions/link/`);

export const unlinkGithubRepo = (projectId: number) => resolvePathToBackendURI(`/integrations/${projectId}/github/actions/unlink/`);
export const getGitIntegrations = (projectId: number) => resolvePathToBackendURI(`/integrations/${projectId}/github/list/repo/`);

export const getCIIntegrationCommnad = (projectId: number) => resolvePathToBackendURI(`/integrations/${projectId}/ci/command/`);
export const getIntegrations = (projectId: number) => resolvePathToBackendURI(`/integrations/${projectId}`);
export const saveWebhookUrlAPI = (projectId: number) => resolvePathToBackendURI(`/integrations/${projectId}/actions/save.webhook`);

export const createFolderAPI = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/folder/create`);
export const deleteFolderAPI = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/folder/delete`);
export const updateFolderAPI = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/folder/rename`);

// export const updateUserMetaAPI = (projectId: number) => resolvePathToBackendURI(`/projects/${projectId}/tests/actions/folder_create`);

// export const updateUserMetaAPI = () => resolvePathToBackendURI(`/users/actions/update.meta`);

export const setupOSS = "/users/actions/oss.init";

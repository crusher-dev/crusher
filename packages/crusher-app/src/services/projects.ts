import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";
import { MonitoringSettings } from "@interfaces/MonitoringSettings";

const RESPONSE_STATUS = {
	PROJECT_CREATED: "PROJECT_CREATED",
	PROJECT_CREATION_FAILED: "PROJECT_CREATION_FAILED",
};

/*
		Expected res: [{id: project.id, name: project.name, team_id: project.team_id}, ...]
 */
export const fetchAllProjects = async (headers = null) => {
	return backendRequest("/projects/getAll", {
		headers: headers,
	}).catch((err) => {
		return null;
	});
};

export const fetchTestsCountInProject = async (projectId, headers = null) => {
	return backendRequest(`/projects/testsCount/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	}).then((count) => {
		return count;
	});
};

export const addProject = async (projectName, headers = null) => {
	return backendRequest("/projects/create", {
		method: RequestMethod.POST,
		headers: headers,
		payload: { projectName },
	}).then((res) => {
		const { status } = res;
		if (status === RESPONSE_STATUS.PROJECT_CREATED) {
			return res.projectId;
		} else {
			return false;
		}
	});
};

export const getAllHosts = async (projectId, headers = null) => {
	return backendRequest(`/hosts/getAll/${projectId}`, {
		method: RequestMethod.GET,
		headers: headers,
	}).then((hosts) => {
		return hosts;
	});
};

export const addHostToProject = async (
	hostName,
	hostUrl,
	projectId,
	headers = null,
) => {
	return backendRequest(`/hosts/create/${projectId}`, {
		method: RequestMethod.POST,
		headers: headers,
		payload: { name: hostName, url: hostUrl },
	}).then((res) => {
		const { status, hostId } = res;
		return status === "CREATED_HOST" ? hostId : null;
	});
};

export const deleteHostFromProject = async (hostId, headers = null) => {
	return backendRequest(`/hosts/delete/${hostId}`, {
		method: RequestMethod.GET,
		headers: headers,
	}).then((res) => {
		return res;
	});
};

export const saveMonitoringSettingsInDB = async (
	settings,
	projectId,
	headers = null,
) => {
	return backendRequest(`/monitoring/settings/${projectId}/save`, {
		method: RequestMethod.POST,
		payload: settings,
		headers: headers,
	}).then((res) => {
		return res;
	});
};

export const getMonitoringSettings = async (
	projectId,
	headers = null,
): Promise<MonitoringSettings> => {
	return backendRequest(`/monitoring/settings/${projectId}/get`, {
		method: RequestMethod.GET,
		headers: headers,
	}).then((res) => {
		return res;
	});
};

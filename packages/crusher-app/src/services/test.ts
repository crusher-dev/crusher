import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";

export const createTest = (
	testName,
	project,
	actions,
	code,
	framework,
	headers = null,
) => {
	return backendRequest("/test/create", {
		method: RequestMethod.POST,
		headers: headers,
		payload: {
			testName,
			projectId: project,
			events: actions,
			code,
			framework,
		},
	});
};

export const updateTestName = (
	testName: string,
	testId: number,
	headers = null,
) => {
	return backendRequest(`/test/updateTest/${testId}`, {
		method: RequestMethod.POST,
		headers: headers,
		payload: {
			testName,
		},
	});
};

export const getTest = (testId, headers = null) => {
	return backendRequest(`/test/get/${testId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const runTestAPI = (testId, headers = null) => {
	return backendRequest(`/test/run/${testId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const createAndRunDraftTest = (
	testName,
	code,
	events,
	projectId,
	headers = null,
) => {
	return backendRequest("/draft/createAndRun/", {
		method: RequestMethod.POST,
		payload: { testName, projectId, events, code },
		headers: headers,
	});
};

export const checkDraftStatus = (draftId, logsAfter, headers = null) => {
	return backendRequest(`/draft/getLastInstanceStatus/${draftId}`, {
		method: RequestMethod.POST,
		headers,
		payload: logsAfter ? { logsAfter } : {},
	});
};

export const _getLiveLogs = (
	draftId: number,
	logsAfter: number,
	headers = null,
) => {
	return backendRequest(`/v2/draft/getLogs/${draftId}`, {
		method: RequestMethod.POST,
		headers,
		payload: logsAfter !== null ? { logsAfter } : {},
	});
};

export const updateAndRunDraftTest = (
	draftId,
	testName,
	code,
	events,
	projectId,
	framework,
	headers,
) => {
	return backendRequest(`/draft/runTest/${draftId}`, {
		method: RequestMethod.POST,
		payload: { testName, code, events, projectId, framework },
		headers: headers,
	});
};

export const getDraftTest = (draftId, headers = null) => {
	return backendRequest(`/draft/get/${draftId}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const createTestFromDraft = (
	draft_id,
	fieldsToUpdate = {},
	headers = null,
) => {
	return backendRequest(`/test/createTestFromDraft/${draft_id}`, {
		method: RequestMethod.POST,
		payload: fieldsToUpdate,
		headers: headers,
	});
};

export const getAllTestsInfosInProject = (
	project_id: number,
	headers = null,
) => {
	return backendRequest(`/test/getAllInfosInProject/${project_id}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

export const _deleteTest = (testId: number, headers = null) => {
	return backendRequest(`/test/delete/${testId}`, {
		headers: headers,
	});
};

export const updateTest = (
	testId,
	testName,
	code,
	projectId,
	headers = null,
) => {
	return backendRequest(`/test/updateTest/${testId}`, {
		method: RequestMethod.POST,
		payload: { testName, projectId, code },
		headers: headers,
	});
};

export const approveAllTests = (jobId: number, referenceJobId: number) => {
	return backendRequest(`/job/approve/tests/all/${jobId}`, {
		method: RequestMethod.GET,
		payload: { referenceJobId: referenceJobId },
	});
};

export const approveAllTestsInPlatform = (
	jobId: number,
	referenceJobId: number,
	platform,
) => {
	return backendRequest(`/job/approve/tests/platform/${platform}/${jobId}`, {
		method: RequestMethod.GET,
		payload: { referenceJobId: referenceJobId },
	});
};

import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";

export const getAllSlackIntegrationsForProject = (project_id, headers = null) => {
	return backendRequest(`/alerting/getSlackIntegrations/${project_id}`, {
		method: RequestMethod.GET,
		headers: headers,
	});
};

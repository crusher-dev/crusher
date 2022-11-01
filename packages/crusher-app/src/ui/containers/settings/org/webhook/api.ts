import { saveWebhookUrlAPI } from "@constants/api";
import { RequestMethod } from "@types/RequestOptions";
import { backendRequest } from "@utils/common/backendRequest";

export const updateWebhookUrl = (webhook: string, projectId: number) => {
	return backendRequest(saveWebhookUrlAPI(projectId), {
		method: RequestMethod.POST,
		payload: {
			webhook: webhook,
		},
	});
};

import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";

export const addCommentForScreenshot = (message, report_id, result_id, headers = null) => {
	return backendRequest("/comments/add", {
		method: RequestMethod.POST,
		headers: headers,
		payload: {
			report_id,
			result_id,
			message,
		},
	});
};

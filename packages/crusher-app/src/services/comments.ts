import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";

export const addCommentForScreenshot = (
	message,
	job_id,
	instance_id,
	screenshot_id,
	result_set_id,
	headers = null,
) => {
	return backendRequest("/comments/add", {
		method: RequestMethod.POST,
		headers: headers,
		payload: {
			job_id,
			instance_id,
			screenshot_id,
			result_set_id,
			message,
		},
	});
};

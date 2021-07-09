import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";

export const getVisualDiff = (baseImage, referenceImage, headers = null) => {
	return backendRequest("/test_instance/getDiff", {
		method: RequestMethod.POST,
		payload: { reference_image: referenceImage, base_image: baseImage },
		headers: headers,
	});
};

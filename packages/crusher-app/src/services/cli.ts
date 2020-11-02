import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "@interfaces/RequestOptions";

export const getUserCLIToken = (headers = null) => {
	return backendRequest("/cli/createTokenIfNotExists", {
		method: RequestMethod.GET,
		headers: headers,
	});
};

import { AxiosRequestConfig } from "axios";
import { createAuthorizedRequestFunc, resolveToBackend } from "electron-app/src/utils/url";

const getUserInfoAPIRequest: () => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any) => {
	return {
		url: resolveToBackend(`/users/actions/getUserAndSystemInfo`),
		method: "GET",
		...authorizationOptions,
	};
}, true);

const updateUserMetaRequest: (data: any) => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any, data: any) => {
	return {
		url: resolveToBackend(`/users/actions/update.meta`),
		method: "POST",
		data,
		...authorizationOptions,
	};
}, true);

export { getUserInfoAPIRequest, updateUserMetaRequest };

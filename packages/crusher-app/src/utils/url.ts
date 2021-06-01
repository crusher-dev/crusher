import { BACKEND_SERVER_URL, FRONTEND_SERVER_URL } from "@constants/other";

const url = require("url");

export const resolvePathToBackendURI = (endpoint: string) => url.resolve(BACKEND_SERVER_URL, endpoint);

export const resolvePathToFrontendURI = (endpoint: string) => url.resolve(FRONTEND_SERVER_URL ? FRONTEND_SERVER_URL : "", endpoint);

export function appendParamsToURI(uri: string, params: { [paramKey: string]: string }) {
	const currentURL = new URL(uri);
	Object.keys(params).forEach((paramKey) => {
		currentURL.searchParams.append(paramKey, params[paramKey]);
	});

	return currentURL.href;
}

export function checkIfAbsoluteURI(uri: string) {
	const rgx = /^https?:\/\//i;
	return rgx.test(uri);
}

export function getAbsoluteURIIfRelative(uri: string) {
	const isAbsolute = checkIfAbsoluteURI(uri);
	if (!isAbsolute) {
		uri = resolvePathToBackendURI(uri);
	}
	return uri;
}

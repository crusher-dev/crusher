const url = require("url");

export function resolvePathToBackendURI(path: string) {
	return url.resolve(process.env.BACKEND_URL, path);
}

export function appendParamsToURI(uri: string, params) {
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

export function resolvePathToFrontendURI(path: string) {
	return url.resolve(process.env.FRONTEND_URL, path);
}

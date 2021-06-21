import { appendParamsToURI, getAbsoluteURIIfRelative } from "./url";
import { IncomingHttpHeaders } from "http";
import { RequestMethod, RequestOptions } from "@interfaces/RequestOptions";

const _fetch = require("node-fetch");

function prepareFetchPayload(uri: string, options: RequestOptions) {
	const method = options.method || RequestMethod.GET;
	let {
        headers = {}
    } = options;
	const {
        payload = {}
    } = options;

	uri = getAbsoluteURIIfRelative(uri);

	switch (method.toUpperCase()) {
		case RequestMethod.GET:
			uri = appendParamsToURI(uri, payload);
			break;
		case RequestMethod.POST:
		case RequestMethod.DELETE:
		case RequestMethod.PUT:
			headers = {
				...headers,
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			};
			break;
		default:
            throw new Error("Invalid post-method passed, only GET and POST supported");
	}

	return { uri, method, headers: headers };
}

export function backendRequest(_uri: string, options?: RequestOptions) {
	const { payload } = options;
	const { uri, method, headers } = prepareFetchPayload(_uri, options);

	return _fetch(uri, {
		headers,
		method,
		credentials: "include",
		body: method !== RequestMethod.GET ? JSON.stringify(payload) : null,
	}).then((requestResponse: any) => {
		if (requestResponse.status === 500) {
			throw new Error("Internal server error");
		}
		return requestResponse.json();
	});
}

export function cleanHeaders(headers: IncomingHttpHeaders) {
	if (headers) {
		delete headers["content-length"];
		delete headers["host"];
		delete headers["origin"];
	}
}

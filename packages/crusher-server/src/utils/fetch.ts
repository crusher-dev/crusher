// HTTP Logging
import { appendParamsToURI } from "./uri";
const _fetch = require("node-fetch").default;

export function prepareFetchPayload(uri: string, info: any = {}) {
	let { method = "GET", header = {}, payload = {} } = info;

	switch (method.toUpperCase()) {
		case "GET":
			uri = appendParamsToURI(uri, payload);
			break;
		case "POST":
			header = {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
				...header,
			};
			break;
		default:
			throw Error("Invalid post-method passed, only GET and POST supported");
	}
	return { uri, method, header };
}

export function fetch(_uri, info: any = {}) {
	const { payload, body, noJSON } = info;
	let { uri, method, header } = prepareFetchPayload(_uri, info);

	return new Promise(async (resolve, reject) => {
		_fetch(uri, {
			headers: header,
			method: method,
			body: body || (payload && method !== "GET" ? JSON.stringify(payload) : null),
		})
			.then(async (res) => {
				if (noJSON) {
					resolve(res.text());
				} else {
					resolve(JSON.parse(await res.text()));
				}
			})
			.catch((err) => {
				reject(err);
			});
	});
}

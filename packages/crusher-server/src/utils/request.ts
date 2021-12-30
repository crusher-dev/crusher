import { appendParamsToURI } from "./url";
import { Logger } from "./logger";
import * as chalk from "chalk";

const _fetch = require("node-fetch").default;

function prepareFetchPayload(uri, options: any = {}) {
	let { method = "GET", headers = {}, payload = {} } = options;

	delete headers["host"];

	switch (method.toUpperCase()) {
		case "GET":
			uri = appendParamsToURI(uri, payload);
			break;
		case "POST":
			headers = {
				...headers,
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			};
			break;
		default:
			throw Error("Invalid post-method passed, only GET and POST supported");
	}
	return { uri, method, headers: headers };
}

export function request(_uri, options: any = {}) {
	const { payload } = options;
	let { uri, method, headers } = prepareFetchPayload(_uri, options);
	const startHrTime = process.hrtime();
	return _fetch(uri, {
		headers,
		method,
		credentials: "include",
		body: method !== "GET" ? JSON.stringify(payload) : null,
	}).then((requestResponse) => {
		try {
			const txt = requestResponse.text();

			const elapsedHrTime = process.hrtime(startHrTime);
			const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

			Logger.info("Request", `${uri} - ${method}  (${chalk.whiteBright.bold(elapsedTimeInMs)})`, { headers, payload });

			return txt
				.then((txt) => {
					const parsedJSON = JSON.parse(txt);
					return parsedJSON;
				})
				.catch(() => txt);
		} catch (err) {
			const elapsedHrTime = process.hrtime(startHrTime);
			const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
			Logger.error("Request", `${uri} - ${method}  (${chalk.whiteBright.bold(elapsedTimeInMs)} ms)`, {
				headers,
				err,
				payload,
			});
			return false;
		}
	});
}

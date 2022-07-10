import { appendParamsToURI, checkIfAbsoluteURI } from "./url";
import * as chalk from "chalk";

const _fetch = require("node-fetch").default;

function prepareFetchPayload(uri, options: any = {}) {
	let method = options.method ? options.method : "GET";
	let headers = options.headers ? options.headers : {};
	let payload = options.payload ? options.payload : {};

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
			throw new Error("Invalid post-method passed, only GET and POST supported");
			break;
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

			console.info("Request", `${uri} - ${method}  (${chalk.whiteBright.bold(elapsedTimeInMs)})`, { headers, payload });

			return txt
				.then((txt) => {
					const parsedJSON = JSON.parse(txt);
					return parsedJSON;
				})
				.catch((err) => {
					return txt;
				});
		} catch (err) {
			const elapsedHrTime = process.hrtime(startHrTime);
			const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
			console.error("Request", `${uri} - ${method}  (${chalk.whiteBright.bold(elapsedTimeInMs)} ms)`, {
				headers,
				err,
				payload,
			});
			return false;
		}
	});
}

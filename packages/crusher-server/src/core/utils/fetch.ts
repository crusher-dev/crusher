import { appendParamsToURI } from "./uri";
import { Logger } from "../../utils/logger";
import * as chalk from "chalk";
const _fetch = require("node-fetch");

export function prepareFetchPayload(uri: string, info: any = {}) {
	let method = info.method ? info.method : "GET";
	let header = info.header ? info.header : {};
	let payload = info.payload ? info.payload : {};

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
			throw new Error("Invalid post-method passed, only GET and POST supported");
			break;
	}
	return { uri, method, header };
}

export function fetch(_uri, info: any = {}) {
	const { payload, body, noJSON } = info;
	let { uri, method, header } = prepareFetchPayload(_uri, info);

	return new Promise(async (resolve, reject) => {
		// HTTP Logging
		const startHrTime = process.hrtime();
		_fetch(uri, {
			headers: header,
			method: method,
			body: body ? body : payload && method !== "GET" ? JSON.stringify(payload) : null,
		})
			.then(async (res) => {
				const elapsedHrTime = process.hrtime(startHrTime);
				const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
				Logger.info("Request", `${uri} - ${method}  (${chalk.whiteBright.bold(elapsedTimeInMs)})`, {
					header,
					res,
					payload,
				});
				if (noJSON) {
					return res.text();
				} else {
					resolve(JSON.parse(await res.text()));
				}
			})
			.catch((err) => {
				const elapsedHrTime = process.hrtime(startHrTime);
				const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
				Logger.error("Request", `${uri} - ${method}  (${chalk.whiteBright.bold(elapsedTimeInMs)} ms)`, {
					header,
					err,
					payload,
				});
				reject(err);
			});
	});
}

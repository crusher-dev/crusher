import { NextApiRequest } from "next";

const cookie = require("cookie");
const jsCookie = require("js-cookie");

export function isUserLoggedInFromCookies(cookies: any): boolean {
	return cookies.isLoggedIn === "true";
}

export function getCookies(req) {
	if (!req) {
		return jsCookie.get();
	}
	const cookies = cookie.parse(req.headers.cookie || "");
	return cookies;
}

function isRequestFromClientSide(req: NextApiRequest) {
	return req ? false : true;
}

export interface iMetaInfoNextReq {
	cookies: any;
	headers: any;
	isClient: boolean;
}

export function getMetaFromReq(req: NextApiRequest): iMetaInfoNextReq {
	const isClient = isRequestFromClientSide(req);

	const cookies = isClient
		? jsCookie.get()
		: cookie.parse(req.headers.cookie || "");

	const headers = isClient ? {} : req.headers;

	delete headers["content-length"];
	delete headers["host"];
	delete headers["origin"];

	return {
		cookies: cookies,
		headers: headers,
		isClient: isClient,
	};
}

export function clearAuthorizationCookies() {
	jsCookie.remove("isLoggedIn");
}

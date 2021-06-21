import { NextApiRequest } from "next";

import * as cookie from "cookie";
import * as jsCookie from "js-cookie";

export function isUserLoggedInFromCookies(cookies: any): boolean {
	return cookies.isLoggedIn === "true";
}

export function getCookies(req: NextApiRequest | null = null) {
	if (!req) {
		return jsCookie.get();
	}
	const cookies = cookie.parse(req.headers.cookie || "");
	return cookies;
}

function isRequestFromClientSide(req: NextApiRequest) {
	return !req;
}

export interface iMetaInfoNextReq {
	cookies: any;
	headers: any;
	isClient: boolean;
}

export function getMetaFromReq(req: NextApiRequest): iMetaInfoNextReq {
	const isClient = isRequestFromClientSide(req);

	const cookies = isClient ? jsCookie.get() : cookie.parse(req.headers.cookie || "");

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

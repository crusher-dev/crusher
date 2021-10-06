import { extractHostname } from "./url";

// Setting an empty user domain in cookie, sets the current opened
// domain by default.
const USER_DOMAIN = "";

export function setUserCookie(cookie, options = {}, res) {
	if (!res) {
		throw new Error("Response object is null.");
	}
	res.cookie(cookie.key, cookie.value, { ...options, sameSite: "none", secure: true });
}

export function setUserAuthorizationCookies(token: string, res) {
	setUserCookie({ key: "token", value: token }, { httpOnly: true, domain: USER_DOMAIN }, res);
	setUserCookie({ key: "isLoggedIn", value: true }, { domain: USER_DOMAIN }, res);

	// // @TODO: Move this logic somewhere else (For gitpod)
	// setUserCookie({ key: "token", value: token }, { httpOnly: true, domain: ".gitpod.io" }, res);
	// setUserCookie({ key: "isLoggedIn", value: true }, { domain: ".gitpod.io" }, res);
}

export function clearUserAuthorizationCookies(req, res) {
	const USER_DOMAIN = req.get("host") ? req.get("host") : "";

	setUserCookie({ key: "token", value: "" }, { httpOnly: true, domain: USER_DOMAIN }, res);
	setUserCookie({ key: "selectedProject", value: false }, { domain: USER_DOMAIN }, res);
	setUserCookie({ key: "isLoggedIn", value: false }, { domain: USER_DOMAIN }, res);
}

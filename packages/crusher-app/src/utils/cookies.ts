const cookie = require("cookie");
const jsCookie = require("js-cookie");

export function getCookies(req) {
	if (!req) {
		return jsCookie.get();
	}
	const cookies = cookie.parse(req.headers.cookie || "");
	return cookies;
}

export function clearAuthorizationCookies() {
	jsCookie.remove("isLoggedIn");
}

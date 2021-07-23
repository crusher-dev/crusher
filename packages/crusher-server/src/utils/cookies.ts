import { extractHostname } from "./url";

const USER_DOMAIN = process.env.FRONTEND_URL ? extractHostname(process.env.FRONTEND_URL) : null;

export function setUserCookie(cookie, options = {}, res) {
	if (!res) {
		throw new Error("Response object is null.");
	}
	res.cookie(cookie.key, cookie.value, { ...options });
}

export function setUserAuthorizationCookies(token: string, res) {
	setUserCookie({ key: "token", value: token }, { httpOnly: true, domain: USER_DOMAIN }, res);
	setUserCookie({ key: "isLoggedIn", value: true }, { domain: USER_DOMAIN }, res);
}

export function clearUserAuthorizationCookies(res) {
	setUserCookie({ key: "token", value: "" }, { httpOnly: true, domain: USER_DOMAIN }, res);
	setUserCookie({ key: "selectedProject", value: false }, { domain: USER_DOMAIN }, res);
	setUserCookie({ key: "isLoggedIn", value: false }, { domain: USER_DOMAIN }, res);
}

export function saveTestEditorDataInCookies(data: any, res: any) {
	const { events, totalTime } = data;
	setUserCookie({ key: "events", value: events }, { domain: USER_DOMAIN }, res);
	setUserCookie({ key: "totalTime", value: totalTime }, { domain: USER_DOMAIN }, res);
}
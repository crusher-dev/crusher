import { Action } from "routing-controllers";
import { clearAuthCookies, decodeToken } from "@utils/auth";
import * as cookie from "cookie";

export function authorization() {
	return async (action: Action) => {
		if (action.request.headers.method === "OPTIONS") {
			action.response.status(200);
			action.response.end();
		}
		try {
			const cookies = action.request.headers.cookie ? cookie.parse(action.request.headers.cookie) : {};
			const userToken = action.request.headers['authorization'] || cookies.token;
			const user = decodeToken(userToken);
			if (!user) {
				clearAuthCookies(action.response);
				return false;
			}
			return user;
		} catch (error) {
			clearAuthCookies(action.response);
			return false;
		}
	};
}

export function getCurrentUserChecker() {
	return async (action: Action) => {
		if (action.request.headers.method === "OPTIONS") {
			action.response.status(200);
			action.response.end();
		}

		try {
			const cookies = action.request.headers.cookie ? cookie.parse(action.request.headers.cookie) : {};
			const userToken = action.request.headers['authorization'] || cookies.token;
			return decodeToken(userToken);
		} catch (error) {
			console.error(error);
			return false;
		}
	};
}

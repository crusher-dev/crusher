import { Action } from 'routing-controllers';
import { clearAuthCookies, decodeToken } from '../../core/utils/auth';
const cookie = require('cookie');

export function authorization() {
	return async (action: Action) => {
		if (action.request.headers.method === 'OPTIONS') {
			action.response.status(200);
			action.response.end();
		}
		try {
			const cookies = cookie.parse(action.request.headers.cookie || '');
			const user = decodeToken(cookies.token);
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
		if (action.request.headers.method === 'OPTIONS') {
			action.response.status(200);
			action.response.end();
		}

		try {
			const { token } = cookie.parse(action.request.headers.cookie);

			return decodeToken(token);
		} catch (error) {
			console.error(error);
			return false;
		}
	};
}
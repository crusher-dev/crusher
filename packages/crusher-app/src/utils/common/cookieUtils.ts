export const getAllCookies = (): Record<string, string> => {
	return document.cookie.split(";").reduce((cookies, cookie) => {
		const [name, value] = cookie.split("=").map((c) => c.trim());
		cookies[name] = value;
		return cookies;
	}, {});
};

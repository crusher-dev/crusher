import {resolveToBackend, resolveToFrontend} from "./url";

const waitForUserLogin = async (callback?: any): Promise<{ loginKey: string; interval }> => {
	const axios = require("axios").default;
	const loginKey = await axios.get(resolveToBackend("/cli/get.key")).then((res) => {
		return res.data.loginKey;
	});

	const interval = setInterval(async () => {
		const loginKeyStatus = await axios.get(resolveToBackend(`/cli/status.key?loginKey=${loginKey}`)).then((res) => res.data);
		if (loginKeyStatus.status === "Validated") {
			clearInterval(interval);
			if (callback) {
				callback(loginKeyStatus.userToken);
			}
		}
	}, 5000);

	return { loginKey: loginKey, interval };
};

export { waitForUserLogin };
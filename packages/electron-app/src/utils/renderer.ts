import { getStore } from "../store/configureStore";
import { getCurrentSelectedProjct, getProxyState } from "../store/selectors/app";
import { turnOnProxy } from "../ui/commands/perform";
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

const turnOnProxyServers = () => {
	const store = getStore();
	const proxyState = getProxyState(store.getState() as any);
	const selectedProject = getCurrentSelectedProjct(store.getState() as any);
	if (Object.keys(proxyState).length) {
		console.error("Proxy is already enabled", proxyState);
		return;
	}
	if (window.localStorage.getItem("projectConfigFile")) {
		const projectConfigFile = window.localStorage.getItem("projectConfigFile");
		const projectConfigFileJson = JSON.parse(projectConfigFile);
		if (projectConfigFileJson[selectedProject]) turnOnProxy(projectConfigFileJson[selectedProject]);
	}
};

export { turnOnProxyServers, waitForUserLogin };
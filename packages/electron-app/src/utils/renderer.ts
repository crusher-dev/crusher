import { getStore } from "../store/configureStore";
import { getCurrentSelectedProjct, getProxyState } from "../store/selectors/app";
import { turnOnProxy } from "../_ui/commands/perform";
import {resolveToBackend} from "./url";
const words = require("./words.json");

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

function getRandArrIndex(arr) {
	return Math.floor(Math.random()* arr.length);
}

export function generateRandomTestName() {
	const  wordsArr = words.data;
	const currentDate = new Date();
	return `${wordsArr[getRandArrIndex(wordsArr)]}-${("0" + currentDate.getHours()).slice(-2) + "" + currentDate.getMinutes()}` 
}
export function setEndOfContenteditable(contentEditableElement)
{
    var range;
    var selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
	//@ts-ignore
    else if(document.selection)//IE 8 and lower
    { 
		//@ts-ignore
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

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
import { JobLogs } from '../server/models/jobLogs';
import { Platform } from '../core/interfaces/Platform';

const { exec } = require("child_process");

export function appendParamsToURI(uri, params) {
	const currentURL = new URL(uri);
	Object.keys(params).forEach((paramKey) => {
		currentURL.searchParams.append(paramKey, params[paramKey]);
	});

	return currentURL.href;
}

export function checkIfAbsoluteURI(uri) {
	const rgx = /^https?:\/\//i;
	return rgx.test(uri);
}

export function extractHostname(url) {
	let hostname;
	//find & remove protocol (http, ftp, etc.) and get hostname

	if (url.indexOf("//") > -1) {
		hostname = url.split("/")[2];
	} else {
		hostname = url.split("/")[0];
	}

	//find & remove port number
	hostname = hostname.split(":")[0];
	//find & remove "?"
	hostname = hostname.split("?")[0];

	return hostname.split(".").slice(-2).join(".");
}

export function createTeamInviteLinkCode(teamId: number){
	return teamId;
};


export function decryptProjectInviteLinkCode(code: string){
	const projectTeamArr = code.split("|");
	return projectTeamArr;
}
export function decryptTeamInviteLinkCode(code: string){
	return code;
}

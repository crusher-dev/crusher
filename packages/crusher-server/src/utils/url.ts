export function appendParamsToURI(uri, params) {
	const currentURL = new URL(uri);
	for (const paramKey of Object.keys(params)) {
		currentURL.searchParams.append(paramKey, params[paramKey]);
	}

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
		[hostname] = url.split("/");
	}

	//find & remove port number
	[hostname] = hostname.split(":");
	//find & remove "?"
	[hostname] = hostname.split("?");

	return hostname.split(".").join(".");
}

import { getUserCLIToken } from "@services/cli";

export function findArrayItemByProperty(arr: Array<any>, property: string) {
	// console.log(arr, property);
	if (!arr || !arr.length) {
		return false;
	}
	const keyToMatch = Object.keys(property)[0];
	const valueToMatch = property[keyToMatch];

	for (const item of arr) {
		if (item[keyToMatch] && item[keyToMatch] == valueToMatch) {
			return item[keyToMatch];
		}
	}

	return false;
}

export function toPascalCase(str: string) {
	if (!str || typeof str !== "string") {
		return str;
	}
	let outString = str?.toLowerCase();
	outString = outString[0]?.toUpperCase() + outString?.substr(1);
	return outString;
}

/* Converts your url into html hyperlink.  */
export function urlify(text: string) {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	return text.replace(urlRegex, function (url) {
		return '<a href="' + url + '">' + url + "</a>";
	});
	// or alternatively
	// return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
}

/* Transform event constants into pretty pascal case*/
export function toPrettyEventName(eventName: string) {
	return eventName
		.split("_")
		.map((name) => toPascalCase(name))
		.join(" ");
}

export function extractHostnameFromUrl(url) {
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

export async function getCLICode(projectId: number, host: string) {
	const token = await getUserCLIToken();
	if (token) {
		return `crusher-cli run --project_id=${projectId}  --crusher_token=${token}`;
	} else {
		return null;
	}
}

export function getTime(date: any) {
	const seconds = Math.floor(((new Date() as any) - date) / 1000);

	let interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " years ago";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " months ago";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		const daysInterval = Math.floor(interval);
		if (daysInterval == 1) {
			return "Yesterday";
		}
		return Math.floor(interval) + " days ago";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " hours ago";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " minutes ago";
	}
	return Math.floor(seconds) + " seconds ago";
}

export function getFirstName(fullName: string) {
	if (!fullName) return fullName;
	return fullName.split(" ")[0];
}

export function getDiffInDays(date1: Date, date2: Date) {
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;

	// Discard the time and time-zone information.
	const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
	const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

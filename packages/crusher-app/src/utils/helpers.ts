import { getUserCLIToken } from "@services/cli";

export function getEdition() {
	return process.env.NEXT_PUBLIC_CRUSHER_MODE;
}

export function findArrayItemByProperty(arr: any[], property: string) {
	if (!arr || !arr.length) {
		return false;
	}
	const [keyToMatch] = Object.keys(property);
	const valueToMatch = property[keyToMatch];

	for (const item of arr) {
		if (item[keyToMatch] && item[keyToMatch] === valueToMatch) {
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
	const urlRegex = /https?:\/\/\S+/g;
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
		[hostname] = url.split("/");
	}

	//find & remove port number
	[hostname] = hostname.split(":");
	//find & remove "?"
	[hostname] = hostname.split("?");

	return hostname.split(".").slice(-2).join(".");
}

export async function getCLICode(projectId: number) {
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
		if (daysInterval === 1) {
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

export function isWindowCrossOrigin(window: Window) {
	try {
		return !(Boolean(window.location.href));
	} catch {
		return true;
	}
}

export function submitPostDataWithForm(url: string, options: any = {}) {
	const form = document.createElement("form");
	form.method = "post";
	form.action = url;
	form.target = "_self";
	const optionKeys = Object.keys(options);
	for (const optionKey of optionKeys) {
		const hiddenField = document.createElement("input");
		hiddenField.type = "hidden";
		hiddenField.name = optionKey;
		hiddenField.value = options[optionKey];

		form.appendChild(hiddenField);
	}

	document.body.appendChild(form);
	form.submit();
	form.remove();
}

export function nth(d: number) {
	if (d > 3 && d < 21) return "th";
	switch (d % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

export function formatAMPM(date: Date) {
    let hours = date.getHours();
    let minutes: string | number = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (!hours)
        hours = 12; // the hour '0' should be '12'
    if (minutes < 10)
        minutes = "0" + minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
}

// Mainly for generating default test name
export function getShortDate(date: Date) {
	const currentDate: Date = new Date();
	if (currentDate.getUTCFullYear() === date.getUTCFullYear()) {
		const day = date.getUTCDate();
		const monthName = date.toLocaleString("default", { month: "long" });
		return `${day}${nth(day)} ${monthName} ${formatAMPM(date)}`;
	}

	// @NOTE: This should never hit but just here a precaution
	return (
		date.getUTCFullYear() +
		"/" +
		("0" + (date.getUTCMonth() + 1)).slice(-2) +
		"/" +
		("0" + date.getUTCDate()).slice(-2) +
		" " +
		("0" + date.getUTCHours()).slice(-2) +
		":" +
		("0" + date.getUTCMinutes()).slice(-2) +
		":" +
		("0" + date.getUTCSeconds()).slice(-2)
	);
}

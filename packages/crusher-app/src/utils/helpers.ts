// import { getUserCLIToken } from "@services/cli";

import { EditionTypeEnum } from "@crusher-shared/types/common/general";

export function getEdition() {
	return process.env.NEXT_PUBLIC_CRUSHER_MODE;
}

export function isWindowCrossOrigin(window: Window) {
	try {
		return !Boolean(window.location.href);
	} catch {
		return true;
	}
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
	if (!hours) hours = 12; // the hour '0' should be '12'
	if (minutes < 10) minutes = "0" + minutes;
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

export function getAssetPath(path: string) {
	if (!path) return path;

	if (getEdition() === EditionTypeEnum.OPEN_SOURCE) {
		return path.includes("localhost:3001/") ? path.replace("localhost:3001/", "output/").replace("http://", "/").replace("https://", "/") : path;
	}

	return path;
}

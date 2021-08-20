const intervals = [
	{ label: "year", seconds: 31536000 },
	{ label: "month", seconds: 2592000 },
	{ label: "day", seconds: 60 * 60 * 24 },
	{ label: "hour", seconds: 60 * 60 },
	{ label: "min", seconds: 60 },
	{ label: "sec", seconds: 1 },
];

export function getStringFromDuration(durationInSec: number) {
	const interval = intervals.find((i) => i.seconds < durationInSec);
	const count = Math.ceil(durationInSec / interval?.seconds) || 1;
	const plural = `${count !== 1 ? "s" : ""}`;

	return `${count} ${interval?.label || "sec"}${plural}`;
}

export function timeSince(date: Date): string {
	const durationInSec = Math.ceil((Date.now() - date.getTime()) / 1000);
	const durationString = getStringFromDuration(durationInSec);

	return `${durationString} ago`;
}

export function getTimeString(date: string): string {
	return new Date(date).toLocaleString("en-GB", { hour12: false });
}

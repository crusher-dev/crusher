const intervals = [
	{ label: "year", seconds: 31536000 },
	{ label: "month", seconds: 2592000 },
	{ label: "day", seconds: 60 * 60 * 24 },
	{ label: "hour", seconds: 60 * 60 },
	{ label: "minute", seconds: 60 },
	{ label: "second", seconds: 1 },
];

export function timeSince(date: Date): string {
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	const interval = intervals.find((i) => i.seconds < seconds);
	const count = Math.floor(seconds / interval?.seconds);
	return `${count} ${interval?.label}${count !== 1 ? "s" : ""} ago`;
}

export function getTimeString(date: string): string {
	return new Date(date).toLocaleString("en-GB", { hour12: false });
}

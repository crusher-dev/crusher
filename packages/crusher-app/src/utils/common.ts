import { OS } from "@constants/app";

export const getOSType = () => {
	if (typeof window === "undefined") return OS.OTHER;
	const ua = window.navigator.userAgent;
	if (ua.includes("Windows")) return OS.Windows;
	if (ua.includes("Mac")) return OS.MAC;
	if (ua.includes("Linux")) return OS.Linux;
	if (ua.includes("X11")) return OS.OTHER;
	return OS.OTHER;
};

export const isBrowser = typeof window !== "undefined";

export const getBoolean = (booleanInStr) => {
	return booleanInStr === "true";
};

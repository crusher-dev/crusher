import devices from "../../../crusher-shared/constants/devices";

export class AdvancedURL {
	static getScheme(url: string) {
		return String(url).replace(/^\/|\/$/g, "");
	}

	static getParameterByName(name: string, url: string) {
		if (!url) url = window.location.href;
		name = name.replace(/[[\]]/g, "\\$&");
		const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
		const results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	static checkIfCrusherExtension(url: string) {
		return (
			Boolean(url) &&
			this.getScheme(url).startsWith(this.getScheme(chrome.runtime.getURL("/")))
		);
	}

	static generateCrusherExtensionUrl(
		targetSiteUrl: string,
		selectedDevice: string,
	): string {
		const url = new URL(targetSiteUrl);

		const crusherAgent = devices.find((device) => device.id === selectedDevice);
		url.searchParams.set("__crusherAgent__", encodeURI(crusherAgent!.userAgent));

		return `${chrome.extension.getURL(
			"test_recorder.html",
		)}?url=${url}&device=${selectedDevice}`;
	}
}

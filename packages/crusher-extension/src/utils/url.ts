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
}

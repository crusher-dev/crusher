import devices from "@shared/constants/devices";
import { getQueryStringParams } from "@shared/utils/url";
import { getDevice } from "./helpers";
import { iDevice } from "@shared/types/extension/device";
import { UserAgent } from "@shared/types/userAgent";
import UserAgents from "@shared/constants/userAgents";

const embeddedUrlRegExp = new RegExp(/^(['"])(.*)\1$/);

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

	static addHttpToUrlIfNotThere(uri: string) {
		const httpRgx = new RegExp(/^https?\:\/\/[\w\._-]+?\.[\w_-]+/i);
		if (!uri.match(httpRgx)) {
			return `http://${uri}`;
		}
		return uri;
	}

	static checkIfCrusherExtension(url: string) {
		return Boolean(url) && this.getScheme(url).startsWith(this.getScheme(chrome.runtime.getURL("/")));
	}

	static getUrlFromCrusherExtensionUrl(extensionUrl: string): string | null {
		const url = getQueryStringParams("url", extensionUrl);

		if (!url || embeddedUrlRegExp.test(url)) {
			return null;
		}

		const embeddedUrlMatches = url.match(embeddedUrlRegExp);

		return new URL(embeddedUrlMatches ? embeddedUrlMatches[2] : url).toString();
	}

	static getDeviceFromCrusherExtensionUrl(extensionUrl: string): iDevice {
		const deviceId = getQueryStringParams("device", extensionUrl);
		const defaultDevice = devices[1];
		if (deviceId) {
			const device = getDevice(deviceId);
			return device ? device : defaultDevice;
		}
		return defaultDevice;
	}

	static getUserAgentFromUrl(iframeURL: string): UserAgent {
		const crusherAgent = AdvancedURL.getParameterByName("__crusherAgent__", iframeURL);

		const selectedUserAgent: UserAgent | undefined = UserAgents.find((agent) => agent.name === (crusherAgent || UserAgents[6].value));

		return selectedUserAgent as UserAgent;
	}
}

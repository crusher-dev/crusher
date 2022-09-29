import { DOM } from "./dom";
import devices from "@shared/constants/devices";
import { iDevice } from "@shared/types/extension/device";
import * as url from "url";

export function executeScript(name: string, tabId: number) {
	return new Promise((resolve, reject) => {
		if (process.env.NODE_ENV === "production") {
			chrome.tabs.executeScript(tabId, { file: `/js/${name}.js`, runAt: "document_end" }, () => {
				resolve(true);
			});
		} else {
			// dev: async fetch bundle
			fetch(`http://localhost:2400/${name}.js`)
				.then((res) => res.text())
				.then((fetchRes) => {
					chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: "document_end" }, () => {
						resolve(true);
					});
				})
				.catch((err) => {
					reject(err);
				});
		}
	});
}

export function submitPostDataWithForm(url: string, options: any = {}): void {
	console.log("URL IS", url);
	const form = document.createElement("form");
	form.method = "post";
	form.action = url;
	form.target = "_blank";
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

interface iElementAttributeInfo {
	name: string;
	value: any;
}

export function getAllAttributes(element: HTMLElement): iElementAttributeInfo[] {
	if (!DOM.isElement(element)) {
		throw new Error("Invalid element provided.");
	}

	const attributeNamesArr: string[] = element.getAttributeNames();

	return attributeNamesArr.map((attributeName) => {
        return {
            name: attributeName,
            value: element.getAttribute(attributeName),
        };
    });
}

export function getDevice(deviceId: string): iDevice | undefined {
	return devices.find((device) => {
		return device.id === deviceId;
	});
}

export function getFrameDepth(winToID: any): number {
	if (winToID === window.top) {
		return 0;
	} else if (winToID.parent === window.top) {
		return 1;
	}

	return 1 + getFrameDepth(winToID.parent);
}

export function toPascalCase(str: string) {
	if (!str || typeof str !== "string") {
		return str;
	}
	let outString = str?.toLowerCase();
	outString = outString[0]?.toUpperCase() + outString?.substr(1);
	return outString;
}

export function toPrettyEventName(eventName: string) {
	return eventName
		.split("_")
		.map((name) => toPascalCase(name))
		.join(" ");
}

export function pxToRemValue(pxValue: number): string {
	return `${pxValue / 16}rem`;
}

export function validURL(str) {
	const pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
			"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
			"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i",
	); // fragment locator

	const localHostRegex = /(localhost|127.0.0.1)(:\d*)?/;
	return !!pattern.test(str) || !!localHostRegex.test(str);
}

export function resolveToFrontend(relativePath: string) {
	return url.resolve(process.env.FRONTEND_URL, relativePath);
}

export function getNodeLevel(node: Node) {
	if (!document.body.contains(node) && node !== document.body) return null;

	let depth = 0;
	while (node !== document.body) {
		node = node.parentNode;
		depth++;
	}
	return depth;
}

export function findDistanceBetweenNodes(node1: Node, node2: Node) {
	return Math.abs(getNodeLevel(node1) - getNodeLevel(node2));
}

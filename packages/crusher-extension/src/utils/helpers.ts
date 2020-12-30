import { DOM } from "./dom";

export function executeScript(name: string, tabId: number, cb?: any) {
	return new Promise((resolve, reject) => {
		if (process.env.NODE_ENV === "production") {
			chrome.tabs.executeScript(
				tabId,
				{ file: `/js/${name}.js`, runAt: "document_end" },
				() => {
					resolve(true);
				},
			);
		} else {
			// dev: async fetch bundle
			fetch(`http://localhost:2400/${name}.js`)
				.then((res) => res.text())
				.then((fetchRes) => {
					chrome.tabs.executeScript(
						tabId,
						{ code: fetchRes, runAt: "document_end" },
						() => {
							resolve(true);
						},
					);
				})
				.catch((err) => {
					reject(err);
				});
		}
	});
}

export function submitPostDataWithForm(url: string, options: any = {}) {
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

export function getAllAttributes(
	element: HTMLElement,
): Array<iElementAttributeInfo> {
	if (!DOM.isElement(element)) {
		throw new Error("Invalid element provided.");
	}

	const attributeNamesArr: Array<string> = element.getAttributeNames();

	return [
		...attributeNamesArr.map((attributeName) => {
			return {
				name: attributeName,
				value: element.getAttribute(attributeName),
			};
		}),
		{ name: "innerHTML", value: element.innerHTML },
		{ name: "innerText", value: element.innerText },
	];
}

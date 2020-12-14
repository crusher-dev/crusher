export function loadScript(name: string, tabId: any, cb: ()=>any) {
	return new Promise((resolve, reject) => {
		if (process.env.NODE_ENV === 'production') {
			chrome.tabs.executeScript(tabId, { file: `/js/${name}.js`, runAt: 'document_end' }, () => {
				resolve(true);
			});
		} else {
			// dev: async fetch bundle
			fetch(`http://localhost:2400/${name}.js`)
				.then((res) => res.text())
				.then((fetchRes) => {
					chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, () => {
						resolve(true);
					});
				}).catch((err)=>{
					reject(err);
			});
		}
	});
}

export function sendPostDataWithForm(url: string, options: any = {}) {
	const form = document.createElement('form');
	form.method = 'post';
	form.action = url;
	form.target = '_blank';
	const optionKeys = Object.keys(options);
	for (const optionKey of optionKeys) {
		const hiddenField = document.createElement('input');
		hiddenField.type = 'hidden';
		hiddenField.name = optionKey;
		hiddenField.value = options[optionKey];

		form.appendChild(hiddenField);
	}

	document.body.appendChild(form);
	form.submit();
	form.remove();
}

export function getAllAttributes(element: any) {
	const attributeNamesArr: Array<string> = element.getAttributeNames();
	return [
		...attributeNamesArr.map((attributeName) => {
			return {
				name: attributeName,
				value: element.getAttribute(attributeName),
			};
		}),
		{ name: 'innerHTML', value: element.innerHTML },
		{ name: 'innerText', value: element.innerText },
	];
}

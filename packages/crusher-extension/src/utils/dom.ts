export function removeAllTargetBlankFromLinks() {
	const { links } = document;
	let i;
	let length;

	for (i = 0, length = links.length; i < length; i++) {
		links[i].target == '_blank' && links[i].removeAttribute('target');
	}
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

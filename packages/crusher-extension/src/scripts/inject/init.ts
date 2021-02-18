// @ts-nocheck
(() => {
	const removeChildren = (element) => {
		while (element.children.length) {
			element.removeChild(element.children[0]);
		}
	};

	removeChildren(document.head);
	removeChildren(document.body);

	const removeAttributes = (element) => {
		Object.values(element.attributes).forEach((attribute) => {
			element.removeAttribute(attribute.name);
		});
	};

	removeAttributes(document.body);
	removeAttributes(document.documentElement);
	fetch(chrome.runtime.getURL("test_recorder.html") /*, options */)
		.then((response) => response.text())
		.then((html) => {
			document.body.innerHTML = html;
			Array.from(document.body.querySelectorAll("script")).forEach((oldScript) => {
				const newScript = document.createElement("script");
				const attrMap = {};
				Array.from(oldScript.attributes).forEach((attr) => {
					attrMap[attr.name] = attr.value;
					newScript.setAttribute(attr.name, attr.value);
				});
				if (attrMap.src) {
					console.log(attrMap);
					newScript.setAttribute("src", chrome.runtime.getURL(attrMap.src));
				}
				newScript.appendChild(document.createTextNode(oldScript.innerHTML));
				oldScript.parentNode.replaceChild(newScript, oldScript);
			});
		});
})();

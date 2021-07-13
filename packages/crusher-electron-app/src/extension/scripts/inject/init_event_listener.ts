import { getFrameDepth } from "../../utils/helpers";
const frameDepth = getFrameDepth(window.self);

if (frameDepth === 0 && !window.location.href.startsWith("chrome-extension://")) {
	fetch(chrome.runtime.getURL("iframe_inject.html") /* , options */)
		.then((response) => response.text())
		.then((html) => {
			const htmlWrapper = document.createElement("div");
			htmlWrapper.innerHTML = html;
			document.body.appendChild(htmlWrapper);

			const linkRel = document.createElement("link");
			linkRel.setAttribute("rel", "stylesheet");
			linkRel.setAttribute("href", chrome.runtime.getURL("styles/overlay.css"));
			fetch(chrome.runtime.getURL("js/content_script.js")).then(async (res) => {
				const script = document.createElement("script");
				script.setAttribute("id", "crusher_content_script");
				script.textContent = await res.text();
				(document.head || document.documentElement).appendChild(script);
			});
			document.head.appendChild(linkRel);
		})
		.catch((err) => {
			console.debug("Something went wrong while appending crusher content script");
			console.error(err);
		});
}

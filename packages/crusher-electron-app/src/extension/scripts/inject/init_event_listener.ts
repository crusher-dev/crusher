import { getFrameDepth } from "../../utils/helpers";
import { setupContentScriptForElectronReload } from "../../utils/electronReload";
const frameDepth = getFrameDepth(window.self);

if (frameDepth === 1 && window.name === "crusher_iframe") {
	setupContentScriptForElectronReload();

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
				script.textContent = await res.text();
				(document.head || document.documentElement).appendChild(script);
				script.remove();
			});
			document.head.appendChild(linkRel);
		})
		.catch((err) => {
			console.debug("Something went wrong while appending crusher content script");
			console.error(err);
		});
}

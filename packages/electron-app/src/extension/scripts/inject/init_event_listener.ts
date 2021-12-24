import { getFrameDepth } from "../../utils/helpers";
const frameDepth = getFrameDepth(window.self);

console.log("Here is here");

async function load() {
	const contentScript = await (window as any).electron.getContentScript();
	const script = document.createElement("script");
	script.setAttribute("id", "crusher_content_script");
	script.textContent = contentScript;
	(document.head || document.documentElement || document).appendChild(script);
}

if (frameDepth === 0 && !window.location.href.startsWith("chrome-extension://")) {
	window.addEventListener("load", function () {
			load();
	});
}

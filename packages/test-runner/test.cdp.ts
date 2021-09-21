import playwright from "playwright";

(async () => {
	const browser = await playwright.chromium.connectOverCDP("ws://127.0.0.1:39847/devtools/page/B0055FA09683274E66B057C0AD834A3A");

	console.log(await browser.contexts());
})();

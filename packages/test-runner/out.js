// Pollyfill
class LogManagerPolyfill {
	logStep(...args) {
		console.log(args[2]);
	}
}

class StoragemanagerPollyfill {
	uploadBuffer(buffer, destionation) {
		return "uploadBuffer.jpg";
		// Stub
	}
	upload(filePath, destination) {
		return "upload.jpg";
		// Stub
	}
	remove(filePath) {
		return "remove.jpg";
		//Stub
	}
}

(async function () {
	const playwright = require("playwright");
	const { saveVideo } = require("playwright-video");

	const { CrusherRunnerActions, handlePopup, registerCrusherSelectorEngine, GlobalManager } = require("../../output/crusher-runner-utils/");

	const globals = new GlobalManager();

	// @TODO: Remove next two lines
	const logManager = new LogManagerPolyfill();
	const storageManager = new StoragemanagerPollyfill();

	const crusherRunnerActionManager = new CrusherRunnerActions(logManager, storageManager, "baseAssetsPath", globals);

	const browser = await playwright["chromium"].launch({
		headless: false,
		args: ["--disable-dev-shm-usage", "--disable-gpu"],
	});

	globals.set("browserContextOptions", { defaultNavigationTimeout: 15000, defaultTimeout: 5000 });
	const browserActions = [
		{
			type: "BROWSER_SET_DEVICE",
			payload: {
				meta: {
					device: { id: "GoogleChromeLargeScreenL", name: "Desktop L", width: 1440, height: 800, visible: true, userAgent: "Google Chrome" },
					userAgent: {
						name: "Google Chrome",
						value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
						appVersion: "Mac OS X 10.14.0",
						platform: "Mac OS X",
					},
				},
			},
		},
	];
	await crusherRunnerActionManager.runActions(browserActions, browser);

	const browserContextOptions = globals.get("browserContextOptions");

	const browserContext = await browser.newContext({
		...browserContextOptions,
	});

	browserContext.setDefaultNavigationTimeout(browserContextOptions.defaultNavigationTimeout);
	browserContext.setDefaultTimeout(browserContextOptions.defaultTimeout);

	const page = await browserContext.newPage({});
	await handlePopup(page, browserContext);
	await registerCrusherSelectorEngine();

	const capturedVideo = await saveVideo(page, "/tmp/crusher/somedir/videos/video.mp4");

	const mainActions = [
		{
			type: "PAGE_NAVIGATE_URL",
			payload: {
				selectors: [
					{ type: "playwright", value: "body", uniquenessScore: 1 },
					{ type: "attribute", value: 'body[jsmodel="TvHxbe"]', uniquenessScore: 1 },
					{
						type: "attribute",
						value: 'body[jsaction="YUC7He:.CLIENT;vPBs3b:.CLIENT;IVKTfe:.CLIENT;HiCeld:.CLIENT;KsNBn:.CLIENT;sbTXNb:.CLIENT;xjhTIf:.CLIENT;O2vyse:.CLIENT;Ez7VMc:.CLIENT;qqf0n:.CLIENT;me3ike:.CLIENT;IrNywb:.CLIENT;Z94jBf:.CLIENT;A8708b:.CLIENT;YcfJ:.CLIENT;A6SDQe:.CLIENT;LjVEJd:.CLIENT;VM8bg:.CLIENT;hWT9Jb:.CLIENT;WCulWe:.CLIENT;NTJodf:.CLIENT;szjOR:.CLIENT;PY1zjf:.CLIENT;wnJTPd:.CLIENT;JL9QDc:.CLIENT;kWlxhc:.CLIENT;qGMTIf:.CLIENT"]',
						uniquenessScore: 1,
					},
					{ type: "PnC", value: "html > body", uniquenessScore: 1, meta: { seedLength: 2, optimized: 2 } },
					{ type: "xpath", value: "BODY", uniquenessScore: 1 },
				],
				meta: { value: "https://www.google.com/" },
			},
			url: "https://www.google.com/?__crusherAgent__=Google%20Chrome",
		},
		{
			type: "ELEMENT_FOCUS",
			payload: {
				selectors: [
					{ type: "playwright", value: '[aria-label="Search"]', uniquenessScore: 1 },
					{ type: "dataAttribute", value: 'input[data-ved="0ahUKEwiRhvGOtZbyAhWVNaYKHT_3C50Q39UDCAQ"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[jsaction="paste:puy29d;"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[maxlength="2048"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[name="q"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[type="text"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[aria-autocomplete="both"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[aria-haspopup="false"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[autocapitalize="off"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[autocomplete="off"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[autocorrect="off"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[autofocus=""]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[role="combobox"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[spellcheck="false"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[title="Search"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[value=""]', uniquenessScore: 1 },
					{ type: "attribute", value: 'input[aria-label="Search"]', uniquenessScore: 1 },
					{ type: "PnC", value: ".a4bIc > .gLFyf", uniquenessScore: 1, meta: { seedLength: 2, optimized: 2 } },
					{ type: "PnC", value: ".SDkEP .gLFyf", uniquenessScore: 1, meta: { seedLength: 3, optimized: 2 } },
					{ type: "PnC", value: ".RNNXgb .gLFyf", uniquenessScore: 1, meta: { seedLength: 4, optimized: 2 } },
					{ type: "PnC", value: ".A8SBwf .gLFyf", uniquenessScore: 1, meta: { seedLength: 5, optimized: 2 } },
					{ type: "PnC", value: "div .gLFyf", uniquenessScore: 1, meta: { seedLength: 6, optimized: 2 } },
					{ type: "PnC", value: "form .gLFyf", uniquenessScore: 1, meta: { seedLength: 7, optimized: 2 } },
					{ type: "PnC", value: ".o3j99 .gLFyf", uniquenessScore: 1, meta: { seedLength: 8, optimized: 2 } },
					{ type: "xpath", value: "BODY/DIV[1]/DIV[3]/FORM[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/INPUT[1]", uniquenessScore: 1 },
				],
				meta: { value: true },
			},
			url: "https://www.google.com/?__crusherAgent__=Google%20Chrome",
		},
		{
			type: "ELEMENT_SCREENSHOT",
			payload: {
				selectors: [
					{ type: "playwright", value: '[alt="Google"]', uniquenessScore: 1 },
					{ type: "dataAttribute", value: 'img[data-atf="1"]', uniquenessScore: 1 },
					{ type: "dataAttribute", value: 'img[data-frt="0"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'img[alt="Google"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'img[height="92"]', uniquenessScore: 1 },
					{ type: "attribute", value: 'img[src="/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"]', uniquenessScore: 1 },
					{
						type: "attribute",
						value: 'img[srcset="/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png 1x, /images/branding/googlelogo/2x/googlelogo_color_272x92dp.png 2x"]',
						uniquenessScore: 1,
					},
					{ type: "attribute", value: 'img[style="outline-style: none; outline-width: 0px;"]', uniquenessScore: 1 },
					{ type: "PnC", value: ".k1zIA > .lnXdpd", uniquenessScore: 1, meta: { seedLength: 2, optimized: 2 } },
					{ type: "PnC", value: ".o3j99 .lnXdpd", uniquenessScore: 1, meta: { seedLength: 3, optimized: 2 } },
					{ type: "PnC", value: ".L3eUgb .lnXdpd", uniquenessScore: 1, meta: { seedLength: 4, optimized: 2 } },
					{ type: "PnC", value: "body .lnXdpd", uniquenessScore: 1, meta: { seedLength: 5, optimized: 2 } },
					{ type: "PnC", value: "html .lnXdpd", uniquenessScore: 1, meta: { seedLength: 6, optimized: 2 } },
					{ type: "xpath", value: "BODY/DIV[1]/DIV[2]/DIV[1]/IMG[1]", uniquenessScore: 1 },
				],
				meta: null,
			},
			url: "",
		},
	];
	await crusherRunnerActionManager.runActions(mainActions, browser, page);

	await capturedVideo.stop();
	await browser.close();

})();

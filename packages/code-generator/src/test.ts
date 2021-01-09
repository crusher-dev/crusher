(async () => {
	const playwright = require("playwright");
	const { Page, Element, Browser } = require("./actions/index");
	const browser = await playwright["chromium"].launch({ headless: false });

	const browserInfo = await Browser.setDevice(
		JSON.parse(
			"{\"type\":\"SET_DEVICE\",\"payload\":{\"meta\":{\"device\":{\"id\":\"GoogleChromeLargeScreen\",\"name\":\"Desktop M (1280 * 800)\",\"width\":1280,\"height\":800,\"visible\":true,\"userAgent\":\"Google Chrome\"},\"userAgent\":{\"name\":\"Google Chrome\",\"value\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36\",\"appVersion\":\"Mac OS X 10.14.0\",\"platform\":\"Mac OS X\"}}}}",
		),
	);
	const browserContext = await browser.newContext({
		userAgent: browserInfo.meta.userAgent,
		viewport: { width: browserInfo.meta.width, height: browserInfo.meta.height },
	});

	const page = await browserContext.newPage({});
	await Page.navigate(
		JSON.parse(
			"{\"type\":\"NAVIGATE_URL\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\"#gsr\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY\",\"uniquenessScore\":1},{\"type\":\"id\",\"value\":\"#gsr\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"body[jsmodel=\\\"TvHxbe\\\"]\",\"uniquenessScore\":1},{\"type\":\"PnC\",\"value\":\"html > #gsr\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}}],\"meta\":{\"value\":\"https://www.google.com/\"}},\"url\":\"https://www.google.com/?__crusherAgent__=Google%20Chrome\"}",
		),
		page,
	);
})();

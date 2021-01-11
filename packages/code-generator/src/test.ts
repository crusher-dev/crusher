(async () => {
	const { Page, Element, Browser } = require(".//actions/index.ts");
	const { sleep } = require("./functions/");
	const playwright = require("playwright");
	const { saveVideo } = require("playwright-video");

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

	await sleep(500);

	const page = await browserContext.newPage({});
	await saveVideo(page, "./video/test.mp4");

	const { handlePopup } = require(".//middlewares");
	handlePopup(page, browserContext);
	await Page.navigate(
		JSON.parse(
			"{\"type\":\"NAVIGATE_URL\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\"body\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY\",\"uniquenessScore\":1},{\"type\":\"PnC\",\"value\":\"html > body\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}}],\"meta\":{\"value\":\"https://www.headout.com/\"}},\"url\":\"https://www.headout.com/?__crusherAgent__=Google%20Chrome\"}",
		),
		page,
	);

	await sleep(500);

	await Page.scroll(
		JSON.parse(
			"{\"type\":\"SCROLL\",\"payload\":{\"selectors\":null,\"meta\":{\"value\":[15]}},\"url\":\"https://www.headout.com/?__crusherAgent__=Google%20Chrome\"}",
		),
		page,
	);
	await sleep(500);

	await Element.click(
		JSON.parse(
			"{\"type\":\"CLICK\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\".circular-list-inner-wrapper > .productCardComponent__ProductCard-hogtmy-0:nth-child(5) > .productCardComponent__CardContainer-hogtmy-1 > .productCardComponent__ProductContent-hogtmy-3 > .productCardComponent__ProductTitle-hogtmy-6\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY/DIV[1]/DIV[1]/DIV[3]/DIV[1]/DIV[6]/DIV[2]/DIV[1]/DIV[3]/DIV[1]/DIV[1]/DIV[5]/DIV[1]/DIV[2]/A[1]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"a[target=\\\"_blank\\\"]\",\"uniquenessScore\":0.034482758620689655},{\"type\":\"attribute\",\"value\":\"a[rel=\\\"noopener noreferrer\\\"]\",\"uniquenessScore\":0.045454545454545456},{\"type\":\"attribute\",\"value\":\"a[href=\\\"/attractions-in-dubai/dubai-safari-park-e-8843/\\\"]\",\"uniquenessScore\":0.5},{\"type\":\"attribute\",\"value\":\"a[style=\\\"outline-style: none; outline-width: 0px;\\\"]\",\"uniquenessScore\":1},{\"type\":\"PnC\",\"value\":\".productCardComponent__ProductCard-hogtmy-0:nth-child(5) .productCardComponent__ProductTitle-hogtmy-6\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".circular-list-inner-wrapper > .productCardComponent__ProductCard-hogtmy-0:nth-child(5) .productCardComponent__ProductTitle-hogtmy-6\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":5,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".circular-list-wrapper .productCardComponent__ProductCard-hogtmy-0:nth-child(5) .productCardComponent__ProductTitle-hogtmy-6\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":6,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".arrow-button-list .productCardComponent__ProductCard-hogtmy-0:nth-child(5) .productCardComponent__ProductTitle-hogtmy-6\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":7,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".arrow-button-list-wrapper .productCardComponent__ProductCard-hogtmy-0:nth-child(5) .productCardComponent__ProductTitle-hogtmy-6\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":8,\"optimized\":2}}],\"meta\":{\"value\":\"\"}},\"url\":\"https://www.headout.com/?__crusherAgent__=Google%20Chrome\"}",
		),
		page,
	);

	await sleep(500);

	await Element.screenshot(
		JSON.parse(
			"{\"type\":\"ELEMENT_SCREENSHOT\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\".product-wrapper-top > .product-wrapper > .product-overview-wrapper-v2 > .product-name-wrapper > .product-name\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY/DIV[1]/DIV[1]/DIV[3]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/H1[1]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"h1[style=\\\"outline-style: none; outline-width: 0px;\\\"]\",\"uniquenessScore\":1},{\"type\":\"PnC\",\"value\":\".product-name-wrapper > .product-name\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".product-overview-wrapper-v2 .product-name\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":3,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".product-wrapper .product-name\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":4,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".product-wrapper-top .product-name\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":5,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".product-page-wrapper .product-name\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":6,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\"div .product-name\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":7,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".content-main .product-name\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":8,\"optimized\":2}}],\"meta\":null},\"url\":\"\"}",
		),
		page,
	);

	await sleep(500);

	await Element.click(
		JSON.parse(
			"{\"type\":\"CLICK\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\"div > .product-main-book-now-card > .content-wrapper > .booker-bottom-wrapper > .date-selection-wrapper\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY/DIV[1]/DIV[1]/DIV[3]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"div[style=\\\"outline-style: none; outline-width: 0px;\\\"]\",\"uniquenessScore\":0.07692307692307693},{\"type\":\"PnC\",\"value\":\".booker-bottom-wrapper > .date-selection-wrapper\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".content-wrapper .date-selection-wrapper\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":3,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".product-main-book-now-card .date-selection-wrapper\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":4,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\"div .date-selection-wrapper\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":5,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".product-wrapper-right .date-selection-wrapper\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":6,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".core-sticky-element .date-selection-wrapper\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":7,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".core-sticky-wrapper .date-selection-wrapper\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":8,\"optimized\":2}}],\"meta\":{\"value\":\"\"}},\"url\":\"https://www.headout.com/attractions-in-dubai/dubai-safari-park-e-8843/\"}",
		),
		page,
	);

	await sleep(500);

	await Element.click(
		JSON.parse(
			"{\"type\":\"CLICK\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\".month-wrapper > .date-list > .date-big-wrapper-dual-month:nth-child(25) > .date-label > .notranslate\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY/DIV[1]/DIV[1]/DIV[3]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[3]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[25]/DIV[1]/SPAN[1]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"span[style=\\\"outline-style: none; outline-width: 0px;\\\"]\",\"uniquenessScore\":0.5},{\"type\":\"PnC\",\"value\":\".date-big-wrapper-dual-month:nth-child(25) .notranslate\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".date-list > .date-big-wrapper-dual-month:nth-child(25) .notranslate\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":4,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".month-wrapper .date-big-wrapper-dual-month:nth-child(25) .notranslate\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":5,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".month-list .date-big-wrapper-dual-month:nth-child(25) .notranslate\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":6,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".date-picker .date-big-wrapper-dual-month:nth-child(25) .notranslate\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":7,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".date-picker-big-dual-month .date-big-wrapper-dual-month:nth-child(25) .notranslate\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":8,\"optimized\":2}}],\"meta\":{\"value\":\"\"}},\"url\":\"https://www.headout.com/attractions-in-dubai/dubai-safari-park-e-8843/\"}",
		),
		page,
	);

	await sleep(500);

	await Element.click(
		JSON.parse(
			"{\"type\":\"CLICK\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\"div > .product-main-book-now-card > .content-wrapper > .booker-bottom-wrapper > .book-now\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY/DIV[1]/DIV[1]/DIV[3]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[3]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"div[style=\\\"outline-style: none; outline-width: 0px;\\\"]\",\"uniquenessScore\":0.05555555555555555},{\"type\":\"PnC\",\"value\":\".booker-bottom-wrapper > .book-now\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".content-wrapper .book-now\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":3,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".product-main-book-now-card .book-now\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":4,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\"div .book-now\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":5,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".product-wrapper-right .book-now\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":6,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".core-sticky-element .book-now\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":7,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".core-sticky-wrapper .book-now\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":8,\"optimized\":2}}],\"meta\":{\"value\":\"\"}},\"url\":\"https://www.headout.com/attractions-in-dubai/dubai-safari-park-e-8843/\"}",
		),
		page,
	);

	await sleep(500);

	await Element.click(
		JSON.parse(
			"{\"type\":\"CLICK\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\".variant-item-wrapper:nth-child(1) > .variant-item-content > .content > .center-section > .desc > span > .read-more-wrapper > .read-more-text > div\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[2]/DIV[5]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[2]/SPAN[1]/DIV[1]/DIV[1]/DIV[1]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"div[style=\\\"outline-style: none; outline-width: 0px;\\\"]\",\"uniquenessScore\":0.125},{\"type\":\"PnC\",\"value\":\".variant-item-wrapper:nth-child(1) .read-more-text:nth-child(1) > div:nth-child(1)\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}}],\"meta\":{\"value\":\"\"}},\"url\":\"https://www.headout.com/book/8843/select/?date=2021-01-20&time=FLEXIBLE_START_TIME\"}",
		),
		page,
	);

	await sleep(500);

	await Element.screenshot(
		JSON.parse(
			"{\"type\":\"ELEMENT_SCREENSHOT\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\".flex:nth-child(2) > .flex > .w-1\\\\/2 > .flex > .flex:nth-child(1)\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/DIV[1]/DIV[2]/DIV[1]/DIV[1]/DIV[1]/DIV[1]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"div[style=\\\"outline-style: none; outline-width: 0px;\\\"]\",\"uniquenessScore\":0.14285714285714285},{\"type\":\"PnC\",\"value\":\".flex:nth-child(2) > .flex > .flex:nth-child(1) > .flex > .flex:nth-child(1)\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".w-full > .flex:nth-child(2) > .flex > .flex:nth-child(1) > .flex > .flex:nth-child(1)\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":6,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".flex .flex:nth-child(2) > .flex > .flex:nth-child(1) > .flex > .flex:nth-child(1)\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":7,\"optimized\":2}}],\"meta\":null},\"url\":\"\"}",
		),
		page,
	);

	await sleep(500);
	await browser.close();
})();

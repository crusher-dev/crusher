const {Page, Element, Browser} = require("crusher-runner-utils/build/actions");
const playwright = require("playwright");
const browser = await playwright["chromium"].launch({ headless: true });
const { saveVideo } = require('playwright-video');
const { sleep } = require("crusher-runner-utils/build/functions");const browserInfo = await Browser.setDevice(JSON.parse("{\"type\":\"SET_DEVICE\",\"payload\":{\"meta\":{\"device\":{\"id\":\"GoogleChromeLargeScreen\",\"name\":\"Desktop M (1280 * 800)\",\"width\":1280,\"height\":800,\"visible\":true,\"userAgent\":\"Google Chrome\"},\"userAgent\":{\"name\":\"Google Chrome\",\"value\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36\",\"appVersion\":\"Mac OS X 10.14.0\",\"platform\":\"Mac OS X\"}}}}"));
const browserContext = await browser.newContext({userAgent: browserInfo.meta.userAgent, viewport: { width: browserInfo.meta.width, height: browserInfo.meta.height}});
await logStep('SET_DEVICE', {status: 'DONE', message: 'SET_DEVICE completed'}, {});

await sleep(500);

const page = await browserContext.newPage({});
await saveVideo(page, 'video.mp4');
const {handlePopup} = require("crusher-runner-utils/build/middlewares");
handlePopup(page, browserContext);
await Page.navigate(JSON.parse("{\"type\":\"NAVIGATE_URL\",\"payload\":{\"selectors\":[{\"type\":\"customFinder\",\"value\":\"#gsr\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"BODY\",\"uniquenessScore\":1},{\"type\":\"id\",\"value\":\"#gsr\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"body[jsmodel=\\\"TvHxbe\\\"]\",\"uniquenessScore\":1},{\"type\":\"PnC\",\"value\":\"html > #gsr\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}}],\"meta\":{\"value\":\"https://www.google.com/\"}},\"url\":\"https://www.google.com/?__crusherAgent__=Google%20Chrome\"}"), page);
await logStep('NAVIGATE_URL', {status: 'DONE', message: 'NAVIGATE_URL completed'}, {});

await sleep(500);
await browser.close();

const playwright = require('playwright');



const DEFAULT_SLEEP_TIME = 500;
const TYPE_DELAY = 100;
function sleep(time){
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			resolve(true);
		}, time);
	})
}

const {
	performance
} = require('perf_hooks');

let lastStepExecutedOn = performance.now();
function logStep(type, data, meta){
	const currentTime = performance.now();
	const timeTakeForThisStep = currentTime - lastStepExecutedOn;
	lastStepExecutedOn = currentTime;
	if(typeof _logStepToMongo !== "undefined"){
		_logStepToMongo(type, data, meta, timeTakeForThisStep);
	}
}
async function waitForSelector(_selectorsJSON, page, defaultSelector = null){
	const _selectors = JSON.parse(_selectorsJSON);
	const selectors = _selectors.map(selector => {return selector;});

	const getElementsByXPath = (xpath, parent) => {
		let results = [];
		let query = document.evaluate(xpath, parent || document,
			null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (let i = 0, length = query.snapshotLength; i < length; ++i) {
			results.push(query.snapshotItem(i));
		}
		return results;
	};

	const generateQuerySelector = function(el) {
		if (el.tagName.toLowerCase() == "html")
			return "HTML";
		var str = el.tagName;
		str += (el.id != "") ? "#" + el.id : "";
		if (el.className) {
			var classes = el.className.split(/\s/);
			for (var i = 0; i < classes.length; i++) {
				str += "." + classes[i]
			}
		}
		return generateQuerySelector(el.parentNode) + " > " + str;
	};

	try{
		await page.waitForSelector(defaultSelector, {state: "attached"});
		return defaultSelector;
	} catch(err){
		const _newSelectors = selectors.filter(selector => {return selector.value !== defaultSelector});
		const validSelector = await page.evaluate((selectors) => {
			for(let i = 0; i < selectors.length; i++){
				try{
					if(selectors[i].type === "xpath"){
						const elements = getElementsByXPath(selectors[i].value);
						if(elements.length){
							return generateQuerySelector(elements[0]);
						}
					} else if(document.querySelector(selectors[i].value)){
						console.log("Valid selector is: " + selectors[i].value);
						return selectors[i].value;
					}
				} catch(ex){
					console.log("Invalid selector: ", selectors[i].value);
				}
				console.log("Selector didn't match: " + selectors[i].value);
			}
			return null;
		}, _newSelectors);
		if(typeof validSelector === "undefined"){
			throw new Error("This is not working");
		}
		return validSelector;
	}
}
let captureVideo;
const browser = await playwright["chromium"].launch({headless: false});

const browserContext = await browser.newContext({userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36', viewport: { width: 1280, height: 800}});
await logStep('SET_DEVICE', {status: 'DONE', message: 'Set user agent to Desktop M (1280 * 800)'}, {name: 'Desktop M (1280 * 800)', width: 1280, height: 800, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'});
const page = await browserContext.newPage({});
page.on("popup", async (popup)=>{
	const popupUrl = await popup.url();
	page.evaluate("window.location.href = \"" + popupUrl + "\"");
	const pages = await browserContext.pages();
	for(let i = 1; i < pages.length; i++){
		await pages[i].close();
	}
});
page.setDefaultTimeout(10000);const {saveVideo} = require('playwright-video');
captureVideo = await saveVideo(page, 'video.mp4');
try{
	await page.goto('https://www.headout.com/');
	await logStep('NAVIGATE_URL', {status: 'DONE', message: 'Navigated to https://www.headout.com/'});
	await sleep(DEFAULT_SLEEP_TIME);
	await page.evaluate(async ([scrollPosArr, selectorKey])=>{
		const scrollTo = async function(element, offset) {
			const fixedOffset = offset.toFixed();
			const onScroll = function () {
				if (element.pageYOffset.toFixed() === fixedOffset) {
					element.removeEventListener('scroll', onScroll);
					return true;
				}
			};

			element.addEventListener('scroll', onScroll);
			onScroll();
			element.scrollTo({
				top: offset,
				behavior: 'smooth'
			});
		};
		const element = selectorKey === "window" ? window : document.querySelector(selectorKey);

		for(let i = 0; i < scrollPosArr.length; i++){
			await scrollTo(element, scrollPosArr[i]);
		}
	}, [[10,140], "window"]);
	await logStep('SCROLL', {status: 'DONE', message: 'Extract info from window'}, {selector: selector_2});
	const selector_3 = await waitForSelector("[{\"type\":\"customFinder\",\"value\":\".phone-wrapper > .android-wrapper > .visible > picture > .image\",\"uniquenessScore\":1},{\"type\":\"uniqueSelector\",\"value\":\".android-wrapper > .visible > picture > .image\",\"uniquenessScore\":1},{\"type\":\"xpath\",\"value\":\"id(\\\"__next\\\")/DIV[1]/DIV[3]/DIV[1]/DIV[8]/DIV[3]/DIV[1]/DIV[1]/PICTURE[1]/IMG[1]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"img[src=\\\"https://cdn-imgix.headout.com/assets/images/views/app-download/Google-Pixel-Really-Blue.png?auto=compress&fm=png&w=345&h=705&crop=faces&fit=min\\\"]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"img[alt=\\\"android\\\"]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"img[height=\\\"470\\\"]\",\"uniquenessScore\":0.5},{\"type\":\"attribute\",\"value\":\"img[url=\\\"https://cdn-imgix.headout.com/assets/images/views/app-download/Google-Pixel-Really-Blue.png\\\"]\",\"uniquenessScore\":1},{\"type\":\"attribute\",\"value\":\"img[format=\\\"png\\\"]\",\"uniquenessScore\":0.5},{\"type\":\"attribute\",\"value\":\"img[style=\\\"outline-style: none; outline-width: 0px;\\\"]\",\"uniquenessScore\":1},{\"type\":\"PnC\",\"value\":\".android-wrapper .image\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":2,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".phone-wrapper > .android-wrapper .image\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":5,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".download-section .android-wrapper .image\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":6,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".feed-page-wrapper .android-wrapper .image\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":7,\"optimized\":2}},{\"type\":\"PnC\",\"value\":\".content-main .android-wrapper .image\",\"uniquenessScore\":1,\"meta\":{\"seedLength\":8,\"optimized\":2}}]", page, ".phone-wrapper > .android-wrapper > .visible > picture > .image");
	const h_3 = await page.$(selector_3);
	await h_3.screenshot({path: 'phonewrapper__androidwrapper__visible__picture__image_3.png'});
	await logStep('ELEMENT_SCREENSHOT', {status: 'DONE', message: 'Took screenshot of .phone-wrapper > .android-wrapper > .visible > picture > .image'}, {selector: selector_3});
	await sleep(DEFAULT_SLEEP_TIME);
	await captureVideo.stop();
	await browser.close();
}catch(ex){ await captureVideo.stop();await browser.close();
	throw ex;}

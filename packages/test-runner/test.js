(async()=>{
	const playwright = require('playwright');

	const browser = await playwright["chromium"].launch({headless: false});
	const browserContext = await browser.newContext({userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36', viewport: { width: 1280, height: 800}});
	await browserContext.addInitScript(()=>{
		document.addEventListener("click", function(event){
			const {target} = event;
			const closestLink = target.closest("a");
			if (closestLink && closestLink.tagName.toLowerCase() === "a") {
				const href = closestLink.getAttribute("href");
				console.log("Going to this link", href);
				if (href) {
					window.location.href = href;
				}
				return event.preventDefault();
			}
		}, true);
	});

	let page = await browserContext.newPage({});
	page.setDefaultTimeout(60000);
	page.on("popup", async (popup)=>{
		const popupUrl = await popup.url();
		page.evaluate("window.location.href = \"" + popupUrl + "\"");
		const pages = await browserContext.pages();
		for(let i = 1; i < pages.length; i++){
			await pages[i].close();
		}
	});
	await page.goto('https://www.headout.com/');
	await page.waitForSelector('.feed-page-wrapper > .emergency-banner-container > .emergency-banner-content > .read-more-section > .read-more-text', {state: "attached"});
	await page.evaluate("window.close()");
	const stv_2 = await page.$('.feed-page-wrapper > .emergency-banner-container > .emergency-banner-content > .read-more-section > .read-more-text');
	await stv_2.scrollIntoViewIfNeeded();
	await stv_2.dispatchEvent('click');
	await page.waitForSelector('.notranslate > .content-main > .banner__StyledBanner-sc-1u3tosm-0 > .internationalBannerContent__Wrapper-sc-1f5x2we-0 > .internationalBannerContent__Heading-sc-1f5x2we-1', {state: "attached"});
	const h_3 = await page.$('.notranslate > .content-main > .banner__StyledBanner-sc-1u3tosm-0 > .internationalBannerContent__Wrapper-sc-1f5x2we-0 > .internationalBannerContent__Heading-sc-1f5x2we-1');
	await h_3.screenshot({path: 'notranslate__contentmain__banner__StyledBannersc1u3tosm0__internationalBannerContent__Wrappersc1f5x2we0__internationalBannerContent__Headingsc1f5x2we1_3.png'});
	await browser.close();
})();

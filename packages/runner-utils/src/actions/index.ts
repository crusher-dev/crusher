import addInput from "./addInput";
import click from "./click";
import hover from "./hover";
import captureElementScreenshot from "./elementScreenshot";
import capturePageScreenshot from "./pageScreenshot";
import elementScroll from "./elementScroll";
import pageScroll from "./pageScroll";
import navigateUrl from "./navigateUrl";
import setDevice from "./setDevice";

module.exports = {
	Element: {
		addInput,
		click,
		hover,
		scroll: elementScroll,
		screenshot: captureElementScreenshot,
		elementScroll,
	},
	Page: {
		screenshot: capturePageScreenshot,
		scroll: pageScroll,
		navigate: navigateUrl,
	},
	Browser: {
		setDevice,
	},
};

import addInput from "./addInput";
import click from "./click";
import hover from "./hover";
import captureElementScreenshot from "./elementScreenshot";
import capturePageScreenshot from "./pageScreenshot";
import elementScroll from "./elementScroll";
import pageScroll from "./pageScroll";
import navigateUrl from "./navigateUrl";
import setDevice from "./setDevice";
import assertElement from './assertElement';
import runCustomScript from "./elementCustomScript";
import focusOnElement from './elementFocus';
import waitForNavigation from './waitForNavigation';

module.exports = {
	Element: {
		addInput,
		click,
		hover,
		scroll: elementScroll,
		screenshot: captureElementScreenshot,
		elementScroll,
		assertElement,
		runCustomScript: runCustomScript,
		focus: focusOnElement
	},
	Page: {
		screenshot: capturePageScreenshot,
		scroll: pageScroll,
		navigate: navigateUrl,
		waitForNavigation: waitForNavigation
	},
	Browser: {
		setDevice,
	},
};

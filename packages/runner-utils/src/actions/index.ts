import { addInputInElement } from "./addInput";
import { clickOnElement } from "./click";
import { hoverOnElement } from "./hover";
import { takeElementScreenshot } from "./elementScreenshot";
import { takePageScreenshot } from "./pageScreenshot";
import { scrollElement } from "./elementScroll";
import { scrollPage } from "./pageScroll";
import { navigateToUrl } from "./navigateUrl";
import { setDevice } from "./setDevice";
import { runAssertionOnElement } from "./assertElement";
import { runCustomScriptOnElement } from "./elementCustomScript";
import { focusOnElement } from "./elementFocus";
import { waitForNavigation } from "./waitForNavigation";

module.exports = {
	Element: {
		addInputInElement,
		clickOnElement,
		hoverOnElement,
		scrollElement,
		takeElementScreenshot,
		runAssertionOnElement,
		runCustomScriptOnElement,
		focus: focusOnElement,
	},
	Page: {
		takePageScreenshot,
		scrollPage,
		waitForNavigation,
	},
	Browser: {
		setDevice,
		navigateToUrl
	},
};

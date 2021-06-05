const { Element, Browser, Page } = require("../src/actions");
import { getCrusherSelectorEngine, sleep } from "../src/functions";
import {handlePopup} from '../src/middlewares/popup';

const playwright = require('playwright');
let browser = null;

beforeAll(async () => {
	const selectorIndex = playwright.selectors._registrations.findIndex(selectorEngine => selectorEngine.name === 'crusher');
	if(selectorIndex === -1){
		playwright.selectors.register('crusher', getCrusherSelectorEngine);
	}

	browser = await playwright["chromium"].launch({
		headless: false
	});
});

afterAll(() =>{
	return browser.close();
});

describe('playwright test', () => {
	let browserContext = null;

	test('set device', async () => {
		const browserInfo = await Browser.setDevice({
			type: "SET_DEVICE",
			payload: {
				meta: {
					device: {
						id: "GoogleChromeLargeScreenXL",
						name: "Desktop XL (1600 * 800)",
						width: 1600,
						height: 800,
						visible: true,
						userAgent: "Google Chrome"
					}
				}
			}
		});

		expect(browserInfo).toStrictEqual({
			message: 'Setup device for testing',
			meta: {width: 1600, height: 800, userAgent: undefined}
		});

		browserContext = await browser.newContext({
			userAgent: browserInfo.meta.userAgent,
			viewport: {
				width: browserInfo.meta.width,
				height: browserInfo.meta.height
			}
		});
		browserContext.setDefaultNavigationTimeout(15000);
		browserContext.setDefaultTimeout(5000);

		expect(browserContext._timeoutSettings._defaultTimeout).toBe(5000);
		expect(browserContext._timeoutSettings._defaultNavigationTimeout).toBe(15000);
	});

	let page = null;
	test('new page', async () => {
		page = await browserContext.newPage({})
	});

	test('handle popup', async () => {
		handlePopup(page, browserContext);
	});

	test('navigate url', async () => {
		await Page.navigate({
			type: "NAVIGATE_URL",
			payload: {
				meta: {
					value: "https://w3schools.com",
					url: "https://w3schools.com"
				}
			}
		}, page);
		return expect(page.url()).toBe("https://www.w3schools.com/");
	});


	test('Tutorials click', async () => {
		await Element.click({
			"type": "CLICK",
			"payload": {
				"selectors": [
					{
						"type": "playwright",
						"value": "text=Tutorials",
						"uniquenessScore": 1
					},
					{
						"type": "id",
						"value": "#navbtn_tutorials",
						"uniquenessScore": 1
					},
					{
						"type": "attribute",
						"value": "a[onclick=\"w3_open_nav('tutorials')\"]",
						"uniquenessScore": 1
					},
					{
						"type": "attribute",
						"value": "a[title=\"Tutorials\"]",
						"uniquenessScore": 1
					},
					{
						"type": "attribute",
						"value": "a[style=\"width: 116px; outline-style: none; outline-width: 0px;\"]",
						"uniquenessScore": 1
					},
					{
						"type": "PnC",
						"value": ".w3-bar > #navbtn_tutorials",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 2,
							"optimized": 2
						}
					},
					{
						"type": "PnC",
						"value": "body #navbtn_tutorials",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 3,
							"optimized": 2
						}
					},
					{
						"type": "PnC",
						"value": "html #navbtn_tutorials",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 4,
							"optimized": 2
						}
					},
					{
						"type": "attribute",
						"value": "a[href=\"javascript:void(0)\"]",
						"uniquenessScore": 0.125
					},
					{
						"type": "xpath",
						"value": "BODY/DIV[3]/A[2]",
						"uniquenessScore": 1
					}
				],
				"meta": {
					"value": ""
				}
			},
			"url": "https://www.w3schools.com/"
		}, page);
		expect(true).toBeTruthy();
	});

	test('Learn icons click', async () => {
		await Element.click({
			"type": "CLICK",
			"payload": {
				"selectors": [
					{
						"type": "playwright",
						"value": "text=Learn Icons",
						"uniquenessScore": 1
					},
					{
						"type": "PnC",
						"value": "#nav_tutorials .w3-col:nth-child(2) > .w3-bar-item:nth-child(7)",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 2,
							"optimized": 2
						}
					},
					{
						"type": "PnC",
						"value": "body > #nav_tutorials .w3-col:nth-child(2) > .w3-bar-item:nth-child(7)",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 6,
							"optimized": 2
						}
					},
					{
						"type": "PnC",
						"value": "html #nav_tutorials .w3-col:nth-child(2) > .w3-bar-item:nth-child(7)",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 7,
							"optimized": 2
						}
					},
					{
						"type": "attribute",
						"value": "a[href=\"/icons/default.asp\"]",
						"uniquenessScore": 0.5
					},
					{
						"type": "attribute",
						"value": "a[style=\"outline-style: none; outline-width: 0px;\"]",
						"uniquenessScore": 0.0625
					},
					{
						"type": "xpath",
						"value": "BODY/NAV[1]/DIV[1]/DIV[1]/DIV[2]/A[6]",
						"uniquenessScore": 1
					}
				],
				"meta": {
					"value": ""
				}
			},
			"url": "https://www.w3schools.com/"
		}, page);
		expect(true).toBeTruthy();
	});

	test('wait for navigation', async() => {
		await Page.waitForNavigation({
			"type": "WAIT_FOR_NAVIGATION",
			"payload": {
				"selectors": [
					{
						"type": "playwright",
						"value": "body",
						"uniquenessScore": 1
					},
					{
						"type": "attribute",
						"value": "body[style=\"position:relative;min-height:100%;font-family: 'Source Sans Pro', sans-serif;\"]",
						"uniquenessScore": 1
					},
					{
						"type": "PnC",
						"value": "html > body",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 2,
							"optimized": 2
						}
					},
					{
						"type": "xpath",
						"value": "BODY",
						"uniquenessScore": 1
					}
				],
				"meta": {
					"value": "/icons/default.asp"
				}
			},
			"url": "https://www.w3schools.com/"
		}, page);
		expect(true).toBeTruthy();
	});

	test('take screenshot', async() => {
		const saveScreenshotRequest = await Element.screenshot({
			"type": "ELEMENT_SCREENSHOT",
			"payload": {
				"selectors": [
					{
						"type": "playwright",
						"value": "h1",
						"uniquenessScore": 1
					},
					{
						"type": "attribute",
						"value": "h1[style=\"outline-style: none; outline-width: 0px;\"]",
						"uniquenessScore": 1
					},
					{
						"type": "PnC",
						"value": "#main > h1",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 2,
							"optimized": 2
						}
					},
					{
						"type": "PnC",
						"value": ".w3-row h1",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 3,
							"optimized": 2
						}
					},
					{
						"type": "PnC",
						"value": "#belowtopnav h1",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 4,
							"optimized": 2
						}
					},
					{
						"type": "PnC",
						"value": "body > #belowtopnav h1",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 5,
							"optimized": 2
						}
					},
					{
						"type": "PnC",
						"value": "html h1",
						"uniquenessScore": 1,
						"meta": {
							"seedLength": 6,
							"optimized": 2
						}
					},
					{
						"type": "xpath",
						"value": "BODY/DIV[7]/DIV[1]/DIV[1]/H1[1]",
						"uniquenessScore": 1
					}
				],
				"meta": null
			},
			"url": ""
		}, page, JSON.parse("6"));
		expect(!!saveScreenshotRequest).toBeTruthy();
	})
});
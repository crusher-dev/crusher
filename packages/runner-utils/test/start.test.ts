const { Browser, Page } = require("../src/actions");
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
		headless: true
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
});
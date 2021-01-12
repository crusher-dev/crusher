// @ts-ignore
import('playwright');
import md5 from 'md5';
import { saveVideo as saveVideoPlaywright } from 'playwright-video';
import { ElementHandle } from 'playwright/lib/client/elementHandle';

import { Page } from 'playwright/lib/client/page';
import { JobPlatform } from '../interfaces/JobPlatform';
import { TestLogsService } from '../services/mongo/testLogs';

let state: any = { platform: JobPlatform.CHROME, isRecordingVideo: false };

export function setTestData(instanceId, _jobInfo, _testInfo, _platform) {
	state = {
		instanceId,
		jobInfo: _jobInfo,
		testInfo: _testInfo,
		platform: _platform,
	};
}

Page.prototype._screenshot = Page.prototype.screenshot;
Page.prototype._click = Page.prototype.click;
Page.prototype._goto = Page.prototype.goto;
Page.prototype._hover = Page.prototype.hover;
ElementHandle.prototype.___screenshot = ElementHandle.prototype.screenshot;

export const saveVideo = function(page: Page, savePath: string, options?: any) {
	console.log('Starting recording video for draft');
	return new Promise(async (resolve, reject) => {
		const pageVideoCapture = await saveVideoPlaywright(page, `/tmp/${state.instanceId}/${state.platform}/video/${state.testInfo.id}.mp4`, options);
		state = { ...state, pageVideoCapture, isRecordingVideo: true };
		return resolve(pageVideoCapture);
	});
};

Page.prototype.goto = async function(url: string, options?: any) {
	const testLogsService = new TestLogsService();
	testLogsService.init(state.testInfo.id, state.instanceId, state.testInfo.testType, state.jobInfo ? state.jobInfo.id : -1);
	// await testLogsService.notify(TEST_LOGS_SERVICE_TAGS.NAVIGATE_PAGE, `Starting navigation to ${url}`);
	const gotoOut = await this._goto(url, options);

	return gotoOut;
};

Page.prototype.screenshot = async function(options?: any) {
	const { path } = options;
	let imageName = path ? path.trim() : '';
	imageName = md5(imageName) + '.png';

	const testLogsService = new TestLogsService();
	testLogsService.init(state.testInfo.id, state.instanceId, state.testInfo.testType, state.jobInfo ? state.jobInfo.id : -1);
	// console.log(`Saving page screenshot to /tmp/images/${state.instanceId}/${state.platform}/${imageName}`);
	// await testLogsService.notify(TEST_LOGS_SERVICE_TAGS.PAGE_SCREENSHOT, `Saving page screenshot to /tmp/images/${state.instanceId}/${state.platform}/${imageName}`);

	const screenshotOut = await this._screenshot({
		...options,
		path: `/tmp/${state.instanceId}/${state.platform}/images/${imageName}`,
	});

	return screenshotOut;
};

ElementHandle.prototype.screenshot = async function(options?: any) {
	const { path } = options;
	let imageName = path ? path.trim() : '';
	imageName = md5(imageName) + '.png';

	const screenshotOut = await this.___screenshot({
		...options,
		path: `/tmp/${state.instanceId}/${state.platform}/images/${imageName}`,
	});
	return screenshotOut;
};

Page.prototype.click = async function(selector: string, options?: any) {
	const testLogsService = new TestLogsService();
	testLogsService.init(state.testInfo.id, state.instanceId, state.testInfo.testType, state.jobInfo ? state.jobInfo.id : -1);

	// console.log(`Performing a click on ${selector}...`);
	// await testLogsService.notify(TEST_LOGS_SERVICE_TAGS.ELEMENT_CLICK, `Performing a click on ${selector}...`);

	const clickOut = await this._click(selector, options);

	return clickOut;
};
Page.prototype.hover = async function(selector: string, options?: any) {
	const testLogsService = new TestLogsService();
	testLogsService.init(state.testInfo.id, state.instanceId, state.testInfo.testType, state.jobInfo ? state.jobInfo.id : -1);

	// console.log(`Performing a hover on ${selector}`);
	// await testLogsService.notify(TEST_LOGS_SERVICE_TAGS.ELEMENT_HOVER, `Performing hover on ${selector}`);
	const hoverOut = await this._hover(selector, options);

	return hoverOut;
};

export const chromium = {
	launch: function(options: any = {}) {
		const playwright = require('playwright');
		return playwright['chromium'].launch({
			...options,
			args: [...(options.args ? options.args : []), '--no-sandbox', '--disable-setuid-sandbox'],
		});
	},
};

export const chrome = chromium;

export const firefox = {
	launch: function(options: any = {}) {
		const playwright = require('playwright');
		return playwright['firefox'].launch({ ...options });
	},
};

export const webkit = {
	launch: function(options: any = {}) {
		const playwright = require('playwright');
		return playwright['webkit'].launch({ ...options });
	},
};

export const safari = webkit;

function getPlatformHandler(platformName: string): any {
	if (!platformName) return null;
	const platform = {
		chrome: chromium,
		chromium: chromium,
		safari: safari,
		webkit: safari,
		firefox: firefox,
	};
	return platform[platformName.toLowerCase()];
}

/*
    This function is exported because it is used by code run by
    CodeRunnerService to start our wrapper which records actions in
    logs and videos which is saved later in the database.

    It also replaces the provided platform if specified by RunJobRequest.
 */
export function boot(platform) {
	const platformToReplace = getPlatformHandler(platform);
	return {
		chromium: platformToReplace ? platformToReplace : chromium,
		chrome: platformToReplace ? platformToReplace : chrome,
		firefox: platformToReplace ? platformToReplace : firefox,
		webkit: platformToReplace ? platformToReplace : webkit,
		safari: platformToReplace ? platformToReplace : safari,
	};
}

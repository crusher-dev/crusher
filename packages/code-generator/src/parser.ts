import { iAction } from "../../crusher-shared/types/action";
import { ACTIONS_IN_TEST } from "../../crusher-shared/constants/recordedActions";
import { BROWSER } from "../../crusher-shared/types/browser";

const helperPackageRequire = process.env.NODE_ENV === "production" ? '__dirname + "/crusher-runner-utils/index.js"' : "'crusher-runner-utils'";

interface iParserOptions {
	isLiveRecording?: boolean;
	shouldLogSteps?: boolean;
	actions: Array<iAction>;
	browser?: BROWSER;
	isHeadless?: boolean;
	assetsDir?: string;
	usePlaywrightChromium?: boolean;
}

export class Parser {
	actions: Array<iAction>;
	codeMap: Array<{
		type: ACTIONS_IN_TEST;
		code: Array<string> | string;
	}> = [];
	isFirstTimeNavigate = true;
	isLiveRecording = false;
	shouldLogSteps = false;
	browser = BROWSER.CHROME;
	isHeadless = true;
	stepIndex = 0;
	assetsDir = "./";
	shouldSleep = true;
	usePlaywrightChromium = false;

	constructor(options: iParserOptions) {
		this.actions = options.actions;
		this.isLiveRecording = !!options.isLiveRecording;
		this.shouldLogSteps = !!options.shouldLogSteps;
		this.browser = options.browser ? options.browser : this.browser;
		this.isHeadless = options.isHeadless ? options.isHeadless : this.isHeadless;
		this.assetsDir = options.assetsDir ? options.assetsDir : this.assetsDir;
		this.usePlaywrightChromium = options.usePlaywrightChromium || false;
		this.stepIndex = 0;
	}

	runPreParseChecks() {
		if (!this.actions.length) {
			throw new Error("No Actions provided");
		}

		if (this.actions[0].type !== ACTIONS_IN_TEST.SET_DEVICE) {
			throw new Error("First action should always be to set the device");
		}

		if (this.actions.length > 1 && this.actions[1].type !== ACTIONS_IN_TEST.NAVIGATE_URL) {
			throw new Error("Navigation to no url is set after setting the device for testing");
		}

		return true;
	}

	parseSetDeviceAction(action: iAction) {
		const code = [];

		code.push(
			"const browserInfo = await Browser.setDevice(JSON.parse(#{action}));".pretify({
				action: action,
			}),
		);

		if (!this.isLiveRecording) {
			code.push(
				"const browserContext = await browser.newContext({userAgent: browserInfo.meta.userAgent, viewport: { width: browserInfo.meta.width, height: browserInfo.meta.height}});",
			);
		} else {
			code.push(
				"const browserContext = await browser.newContext({userAgent: browserInfo.meta.userAgent, viewport: { width: browserInfo.meta.width, height: browserInfo.meta.height}});",
			);
		}

		code.push(
			"browserContext.setDefaultNavigationTimeout(15000);",
			"browserContext.setDefaultTimeout(5000);",
			`await browserContext.addCookies([{
				name: "h-sid",
				value: "AQAAAXnN6yuZAAAAOKcCQqwRAAJ2fHLwkMzVKsxdxrCwXfy3",
				domain: ".test-headout.com",
				path: "/",
				expires: 1638209412,
			}]);`,
		);

		return code;
	}

	parseNavigateUriAction(action: iAction) {
		const code = [];
		if (this.isFirstTimeNavigate) {
			code.push("const page = await browserContext.newPage({});");
			if (this.isLiveRecording && this.browser === BROWSER.CHROME) {
				const videoPath = this.assetsDir + "/videos/video.mp4";
				code.push(`capturedVideo = await saveVideo(page, '${videoPath}');`);
			}
			code.push(`const {handlePopup} = require(${helperPackageRequire}).Middlewares;`);
			code.push("handlePopup(page, browserContext);");
			this.isFirstTimeNavigate = false;
		}
		code.push(
			"await Page.navigate(JSON.parse(#{action}), page);".pretify({
				action: action,
			}),
		);
		return code;
	}

	parseWaitForNavigation(action: iAction) {
		const code = [];

		code.push(
			"await Page.waitForNavigation(JSON.parse(#{action}), page);".pretify({
				action: action,
			}),
		);
		return code;
	}

	parsePageScreenshot(action: iAction) {
		const code = [];
		code.push(
			"var saveScreenshotRequest = await Page.screenshot(page, JSON.parse(#{stepIndex}));".pretify({
				stepIndex: this.stepIndex,
			}),
		);
		code.push("if(handleImageBuffer) handleImageBuffer(saveScreenshotRequest.output.value, saveScreenshotRequest.output.name);");
		return code;
	}

	parseElementClick(action: iAction) {
		const code = [];
		code.push(
			"await Element.click(JSON.parse(#{action}), page);".pretify({
				action: action,
			}),
		);

		return code;
	}

	parseElementHover(action: iAction) {
		const code = [];
		code.push(
			"await Element.hover(JSON.parse(#{action}), page);".pretify({
				action: action,
			}),
		);

		return code;
	}

	parseElementScreenshot(action: iAction) {
		const code = [];
		code.push(
			"var saveScreenshotRequest = await Element.screenshot(JSON.parse(#{action}), page, JSON.parse(#{stepIndex}));".pretify({
				action,
				stepIndex: this.stepIndex,
			}),
		);
		code.push("if(handleImageBuffer) handleImageBuffer(saveScreenshotRequest.output.value, saveScreenshotRequest.output.name);");
		return code;
	}

	parseScroll(action: iAction) {
		const code = [];
		const isWindowScroll = !action.payload.selectors;
		if (isWindowScroll) {
			code.push("await Page.scroll(JSON.parse(#{action}), page);".pretify({ action }));
		} else {
			code.push("await Element.scroll(JSON.parse(#{action}), page);".pretify({ action }));
		}

		return code;
	}

	parseAddInput(action: iAction) {
		const code = [];
		code.push("await Element.addInput(JSON.parse(#{action}), page);".pretify({ action }));
		return code;
	}

	parseAssertElement(action: iAction) {
		const code = [];
		code.push(
			"let {meta} = await Element.assertElement(#{action}, page);\n".pretify({
				action,
			}),
		);
		code.push("let [hasPassed, logs] = meta.output;");
		code.push("if(!hasPassed){throw new Error('Assertion not passed');}");

		return code;
	}

	parseElementFocus(action: iAction) {
		const code = [];
		code.push(
			"await Element.focus(JSON.parse(#{action}), page);\n".pretify({
				action,
			}),
		);

		return code;
	}

	parseCustomElementScript(action: iAction) {
		const code = [];
		code.push(
			"await Element.runCustomScript(JSON.parse(#{action}), page);\n".pretify({
				action,
			}),
		);

		return code;
	}

	parseAction(action: iAction) {
		switch (action.type) {
			case ACTIONS_IN_TEST.SET_DEVICE: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.SET_DEVICE,
					code: this.parseSetDeviceAction(action),
				});
				break;
			}
			case ACTIONS_IN_TEST.NAVIGATE_URL: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.NAVIGATE_URL,
					code: this.parseNavigateUriAction(action),
				});
				break;
			}
			case ACTIONS_IN_TEST.WAIT_FOR_NAVIGATION: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.WAIT_FOR_NAVIGATION,
					code: this.parseWaitForNavigation(action),
				});
				break;
			}
			case ACTIONS_IN_TEST.PAGE_SCREENSHOT: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.PAGE_SCREENSHOT,
					code: this.parsePageScreenshot(action),
				});
				break;
			}
			case ACTIONS_IN_TEST.CLICK: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.CLICK,
					code: this.parseElementClick(action),
				});
				break;
			}
			case ACTIONS_IN_TEST.ELEMENT_FOCUS: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.ELEMENT_FOCUS,
					code: this.parseElementFocus(action),
				});
				break;
			}
			case ACTIONS_IN_TEST.CUSTOM_ELEMENT_SCRIPT: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.CUSTOM_ELEMENT_SCRIPT,
					code: this.parseCustomElementScript(action),
				});
				break;
			}
			case ACTIONS_IN_TEST.ELEMENT_SCREENSHOT: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.ELEMENT_SCREENSHOT,
					code: this.parseElementScreenshot(action),
				});
				break;
			}
			case ACTIONS_IN_TEST.SCROLL:
				this.codeMap.push({
					type: ACTIONS_IN_TEST.SCROLL,
					code: this.parseScroll(action),
				});
				break;
			case ACTIONS_IN_TEST.ADD_INPUT:
				this.codeMap.push({
					type: ACTIONS_IN_TEST.ADD_INPUT,
					code: this.parseAddInput(action),
				});
				break;
			case ACTIONS_IN_TEST.HOVER: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.HOVER,
					code: this.parseElementHover(action),
				});
				break;
			}
			case ACTIONS_IN_TEST.ASSERT_ELEMENT: {
				this.codeMap.push({
					type: ACTIONS_IN_TEST.ASSERT_ELEMENT,
					code: this.parseAssertElement(action),
				});
				break;
			}
			default:
				console.debug(`Invalid action recorded, no handler for ${action.type}`);
		}
	}

	parseActions() {
		this.runPreParseChecks();
		for (const action of this.actions) {
			this.parseAction(action);
			this.stepIndex++;
		}
	}

	addTryCatch(mainCode: string) {
		const code = [];
		code.push("try{");
		code.push(mainCode);
		code.push("} catch(ex){");
		code.push(`
			if(typeof capturedVideo !== "undefined") { await capturedVideo.stop()};
			if(browser) { await browser.close();}
			throw ex;
		`);
		code.push("}");
		return code.join("\n");
	}

	registerCrusherSelector(code: string) {
		code += "if(playwright.selectors._registrations.findIndex(selectorEngine => selectorEngine.name === 'crusher') === -1){\n";
		code += "\tplaywright.selectors.register('crusher', getCrusherSelectorEngine);\n";
		code += "}\n";
		return code;
	}

	getCode() {
		let importCode = `const {Page, Element, Browser} = require(${helperPackageRequire}).Actions;\nconst playwright = require("${
			this.usePlaywrightChromium ? "playwright-chromium" : "playwright"
		}");\n`;
		importCode += `const {getCrusherSelectorEngine} = require(${helperPackageRequire}).Functions;\n`;
		importCode = this.registerCrusherSelector(importCode);
		importCode += `const browser = await playwright["${this.browser}"].launch({ ${
			this.usePlaywrightChromium ? `executablePath: "${process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}",` : ""
		} headless: ${this.isHeadless.toString()} });\n`;

		if (this.shouldSleep) {
			importCode += `const { sleep } = require(${helperPackageRequire}).Functions;\n`;
		}
		if (this.isLiveRecording && this.browser === BROWSER.CHROME) {
			importCode += "const { saveVideo } = require('playwright-video');\n";
			importCode += "let capturedVideo;\n";
		}

		let footerCode = "";
		if (this.isLiveRecording) {
			footerCode += "if(typeof capturedVideo !== 'undefined') { await capturedVideo.stop()}\n";
		}
		footerCode += "await browser.close();";

		const mainCode = this.codeMap
			.map((codeItem, index) => {
				let code = typeof codeItem.code === "string" ? codeItem : codeItem.code.join("\n");
				if (this.shouldLogSteps) {
					code += `\nawait logStep('${codeItem.type}', {status: 'DONE', message: '${codeItem.type} completed'}, {});\n`;
				}
				const nextItem = index + 1 < this.codeMap.length ? this.codeMap[index + 1] : undefined;

				if (
					this.shouldSleep &&
					codeItem.type !== ACTIONS_IN_TEST.WAIT_FOR_NAVIGATION &&
					nextItem &&
					nextItem.type != ACTIONS_IN_TEST.WAIT_FOR_NAVIGATION
				) {
					code += "\nawait sleep(1500);";
				}
				return code;
			})
			.join("\n\n");

		return importCode + this.addTryCatch(mainCode) + "\n" + footerCode;
	}
}

declare global {
	interface String {
		pretify(values: { [value: string]: any }): string;
	}
}

String.prototype.pretify = function (values) {
	const matches = this.match(/#\{.+?}/g);
	// eslint-disable-next-line @typescript-eslint/no-this-alias
	let pretified = this;

	for (const m in matches) {
		const match = matches[m];
		const evalCode = match.substr(2, match.length - 3);

		pretified = pretified.replace(match, JSON.stringify(JSON.stringify(values[evalCode])));
	}

	return pretified;
};

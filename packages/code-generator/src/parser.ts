import { iAction } from "../../crusher-shared/types/action";
import { ACTIONS_IN_TEST } from "../../crusher-shared/constants/recordedActions";
import { BROWSER } from "../../crusher-shared/types/browser";

const helperPackageName = "./";

interface iParserOptions {
	isLiveRecording?: boolean;
	shouldLogSteps?: boolean;
	actions: Array<iAction>;
	browser?: BROWSER;
	isHeadless?: boolean;
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

	constructor(options: iParserOptions) {
		this.actions = options.actions;
		this.isLiveRecording = !!options.isLiveRecording;
		this.shouldLogSteps = !!options.shouldLogSteps;
		this.browser = options.browser ? options.browser : this.browser;
		this.isHeadless = options.isHeadless ? options.isHeadless : this.isHeadless;
	}

	runPreParseChecks() {
		if (!this.actions.length) {
			throw new Error("No Actions provided");
		}

		if (this.actions[0].type !== ACTIONS_IN_TEST.SET_DEVICE) {
			throw new Error("First action should always be to set the device");
		}

		if (
			this.actions.length > 1 &&
			this.actions[1].type !== ACTIONS_IN_TEST.NAVIGATE_URL
		) {
			throw new Error(
				"Navigation to no url is set after setting the device for testing",
			);
		}

		return true;
	}

	parseSetDeviceAction(action: iAction) {
		const code = [];

		code.push(
			"const browserInfo = await Browser.setDevice(JSON.parse(#{action}));".pretify(
				{
					action: action,
				},
			),
		);

		if (!this.isLiveRecording) {
			code.push(
				"const browserContext = await browser.newContext({userAgent: browserInfo.meta.userAgent, viewport: { width: browserInfo.meta.width, height: browserInfo.meta.height}});",
			);
		} else {
			code.push(
				"const browserContext = await browser.newContext({userAgent: browserInfo.meta.userAgent, viewport: { width: browserInfo.meta.width, height: browserInfo.meta.height}, recordVideo: {dir: './video'}});",
			);
		}

		return code;
	}

	parseNavigateUriAction(action: iAction) {
		const code = [];
		if (this.isFirstTimeNavigate) {
			code.push("const page = await browserContext.newPage({});");
			if (this.isLiveRecording && this.browser === BROWSER.CHROME) {
				code.push("await saveVideo(page, '/tmp/video.mp4')");
			}
			code.push(
				`const {handlePopup} = require("${helperPackageName}/middlewares");`,
			);
			code.push("handlePopup(page, browserContext);");
			this.isFirstTimeNavigate = false;
		}
		code.push(
			"await Page.navigate(JSON.parse(#{action}), page)".pretify({
				action: action,
			}),
		);
		return code;
	}

	parsePageScreenshot(action: iAction) {
		const code = [];
		code.push("await Page.screenshot();");
		return code;
	}

	parseElementClick(action: iAction) {
		const code = [];
		code.push(
			"await Element.click(JSON.parse(#{action}), page)".pretify({
				action: action,
			}),
		);

		return code;
	}

	parseElementHover(action: iAction) {
		const code = [];
		code.push(
			"await Element.hover(JSON.parse(#{action}), page)".pretify({
				action: action,
			}),
		);

		return code;
	}

	parseElementScreenshot(action: iAction) {
		const code = [];
		code.push(
			"await Element.screenshot(JSON.parse(#{action}), page);".pretify({ action }),
		);
		return code;
	}

	parseScroll(action: iAction) {
		const code = [];
		const isWindowScroll = !action.payload.selectors;
		if (isWindowScroll) {
			code.push(
				"await Page.scroll(JSON.parse(#{action}), page)".pretify({ action }),
			);
		} else {
			code.push(
				"await Element.scroll(JSON.parse(#{action}), page)".pretify({ action }),
			);
		}

		return code;
	}

	parseAddInput(action: iAction) {
		const code = [];
		code.push(
			"await Element.addInput(JSON.parse(#{action}), page)".pretify({ action }),
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
			default:
				console.debug(`Invalid action recorded, no handler for ${action.type}`);
		}
	}

	parseActions() {
		this.runPreParseChecks();
		for (const action of this.actions) {
			this.parseAction(action);
		}
	}

	getCode() {
		let importCode = `const {Page, Element, Browser} = require("${helperPackageName}/actions/index.ts");\nconst playwright = require("playwright");\n`;
		importCode += `const browser = await playwright["${
			this.browser
		}"].launch({ headless: ${this.isHeadless.toString()} });\n`;

		if (this.isLiveRecording && this.browser === BROWSER.CHROME) {
			importCode += "const { saveVideo } = require('playwright-video');\n";
			importCode += `const { sleep } = require("${helperPackageName}/functions/")`;
		}

		const footerCode = "await browser.close()";
		const mainCode = this.codeMap
			.map((codeItem) => {
				let code =
					typeof codeItem.code === "string" ? codeItem : codeItem.code.join("\n");
				if (this.shouldLogSteps) {
					code += `\nawait logStep('${codeItem.type}', {status: 'DONE', message: '${codeItem.type} completed'}, {});\n`;
				}
				if (this.isLiveRecording && this.browser === BROWSER.CHROME) {
					code += "\nawait sleep(500);";
				}
				return code;
			})
			.join("\n\n");

		return importCode + mainCode + "\n" + footerCode;
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

		pretified = pretified.replace(
			match,
			JSON.stringify(JSON.stringify(values[evalCode])),
		);
	}

	return pretified;
};

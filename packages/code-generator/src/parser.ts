import { iAction } from "../../crusher-shared/types/action";
import { ACTIONS_IN_TEST } from "../../crusher-shared/constants/recordedActions";

export class Parser {
	actions: Array<iAction>;
	codeMap: Array<{
		type: ACTIONS_IN_TEST;
		code: Array<string> | string;
	}> = [];
	isFirstTimeNavigate = true;

	constructor(actions: Array<iAction>) {
		this.actions = actions;
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
		code.push(
			"const browserContext = await browser.newContext({userAgent: browserInfo.meta.userAgent, viewport: { width: browserInfo.meta.width, height: browserInfo.meta.height}});",
		);
		return code;
	}

	parseNavigateUriAction(action: iAction) {
		const code = [];
		if (this.isFirstTimeNavigate) {
			code.push("const page = await browserContext.newPage({});");
			this.isFirstTimeNavigate = false;
		}
		code.push(
			"await Page.navigate(JSON.parse(#{action}), page)".pretify({
				action: action,
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
		const helperPackageName = "crusher-generator";
		const importCode = `const {Page, Element, Browser} = require("${helperPackageName}");\n`;

		const mainCode = this.codeMap
			.map((codeItem) => {
				const code =
					typeof codeItem.code === "string" ? codeItem : codeItem.code.join("\n");
				return code;
			})
			.join("\n\n");

		return importCode + mainCode;
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
